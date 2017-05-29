import {action} from "janet-ts";

import {
  Annotation,
  BodyAnnotation,
  FieldAnnotation,
  NamedAnnotation,
  PathParamAnnotation,
  QueryAnnotation,
  RequestHeaderAnnotation,
  ResponseHeaderAnnotation
} from "./HTTPAnnotation";

export * from "./HTTPAnnotation";

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "HEAD";

export const metaKey = "META::HTTPAction";

export interface RequestScheme {
  url: string;
  method: Method;
  formFields: FieldAnnotation[];
  queryParams: QueryAnnotation[];
  pathParams: PathParamAnnotation[];
  requestHeaders: RequestHeaderAnnotation[];
  responseHeaders: ResponseHeaderAnnotation[];
  body: BodyAnnotation | null;
}

interface HTTPRequestInfo {
  url: string;
  method: Method;
  annotations: any;
}

interface AnnotationConstructor<T> {
  new (...params: any[]): T;
  name?: string;
}

function extractRequestInfo(action: any): HTTPRequestInfo | null {
  return Reflect.getMetadata(metaKey, action.constructor);
}

function extractFields<T extends Annotation>(requestInfo: HTTPRequestInfo,
                                             annotationType: AnnotationConstructor<T>): T[] {
  const annotations = requestInfo.annotations[annotationType.name];
  if (annotations) {
    return annotations;
  } else {
    return [];
  }
}

function extractField<T extends Annotation>(requestInfo: HTTPRequestInfo,
                                            annotationType: AnnotationConstructor<T>): T | null {
  const annotations = extractFields(requestInfo, annotationType);
  if (annotations[0]) {
    return annotations[0];
  } else {
    return null;
  }
}

export function isHTTPAction(action: any): boolean {
  const requestInfo = extractRequestInfo(action);
  return requestInfo != null;
}

export function parseHTTPAction(action: any): RequestScheme {

  const requestInfo = extractRequestInfo(action);
  if (requestInfo == null) {
    throw new Error("Invalid HTTP Action:" + action);
  }

  const body = extractField(requestInfo, BodyAnnotation);

  return {
    url: requestInfo.url,
    method: requestInfo.method,
    formFields: extractFields(requestInfo, FieldAnnotation),
    queryParams: extractFields(requestInfo, QueryAnnotation),
    pathParams: extractFields(requestInfo, PathParamAnnotation),
    requestHeaders: extractFields(requestInfo, RequestHeaderAnnotation),
    responseHeaders: extractFields(requestInfo, ResponseHeaderAnnotation),
    body: body
  };
}

export interface NamedValue {
  name: string;
  value: any;
}

export interface HTTPRequest {
  url: string;
  method: Method;
  queryParams: NamedValue[];
  headers: any;
  body: any;
}

function applyPathParams(url: string, params: NamedValue[]): string {
  let updatedURL = url;

  params.forEach((pathParam: NamedValue) => {
    updatedURL = updatedURL.replace("{" + pathParam.name + "}", pathParam.value);
  });

  return updatedURL;
}

function applyQueryParams(url: string, params: NamedValue[]): string {
  if (params.length > 0) {
    const queryPairs = params.map((param: NamedValue) => {
      return param.name + "=" + param.value;
    });

    return url + "?" + queryPairs.join("&");
  } else {
    return url;
  }
}

function toHash(values: NamedValue[]): any {
  const hash: any = {};

  values.forEach((value: NamedValue) => {
    hash[value.name] = value.value;
  });

  return hash;
}

export function createHTTPRequestFromScheme(action: any, scheme: RequestScheme): HTTPRequest {

  const toParams = (annotation: NamedAnnotation): NamedValue => {
    return {
      name: annotation.name,
      value: annotation.propertyAccessor.readValue(action)
    };
  };

  const pathParams: NamedValue[] = scheme.pathParams.map(toParams);
  const queryParams: NamedValue[] = scheme.queryParams.map(toParams);
  const headers: any = toHash(scheme.requestHeaders.map(toParams));
  const formFields: NamedValue[] = scheme.formFields.map(toParams);

  let body = scheme.body != null ? scheme.body.propertyAccessor.readValue(action) : null;

  if (!body && formFields.length > 0) {
    body = {};
    formFields.forEach((param: NamedValue) => {
      body[param.name] = param.value;
    });
  }

  let url = applyPathParams(scheme.url, pathParams);
  url = applyQueryParams(url, queryParams);

  return {
    url: url,
    method: scheme.method,
    queryParams: queryParams,
    headers: headers,
    body: body
  };
}

export function createHTTPRequestFromAction(action: any): HTTPRequest {
  const scheme = parseHTTPAction(action);
  return createHTTPRequestFromScheme(action, scheme);
}

export function HttpAction(url: string, method: Method = "GET"): ClassDecorator {
  return (target: any) => {

    let metadata = Reflect.getMetadata(metaKey, target);

    if (!metadata) {
      metadata = {
        annotations: {}
      };
    }

    metadata.url = url;
    metadata.method = method;

    Reflect.defineMetadata(metaKey, metadata, target);

    return action(target);
  };
}
