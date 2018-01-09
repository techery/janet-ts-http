import {action} from "janet-ts";

import {
  Annotation,
  BodyAnnotation,
  FieldAnnotation,
  NamedAnnotation,
  PathParamAnnotation,
  QueryAnnotation,
  RequestHeaderAnnotation,
  ResponseHeaderAnnotation,
} from "./HTTPAnnotation";

export * from "./HTTPAnnotation";

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "HEAD";

export const metaKey = "META::HTTPAction";

export interface RequestScheme {
  readonly url: string;
  readonly method: Method;
  readonly formFields: ReadonlyArray<FieldAnnotation>;
  readonly queryParams: ReadonlyArray<QueryAnnotation>;
  readonly pathParams: ReadonlyArray<PathParamAnnotation>;
  readonly requestHeaders: ReadonlyArray<RequestHeaderAnnotation>;
  readonly responseHeaders: ReadonlyArray<ResponseHeaderAnnotation>;
  readonly body: BodyAnnotation | null;
}

interface HTTPRequestInfo {
  readonly url: string;
  readonly method: Method;
  readonly annotations: any;
}

interface AnnotationConstructor<T> {
  new (...mutableParams: any[]): T;
  readonly name?: string;
}

function extractRequestInfo(httpAction: any): HTTPRequestInfo | null {
  return Reflect.getMetadata(metaKey, httpAction.constructor);
}

function extractFields<T extends Annotation>(requestInfo: HTTPRequestInfo,
                                             annotationType: AnnotationConstructor<T>): ReadonlyArray<T> {
  const annotations = requestInfo.annotations[annotationType.name!];
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

export function isHTTPAction(httpAction: any): boolean {
  const requestInfo = extractRequestInfo(httpAction);
  return requestInfo != null;
}

export function parseHTTPAction(httpAction: any): RequestScheme {

  const requestInfo = extractRequestInfo(httpAction);
  if (requestInfo == null) {
    throw new Error("Invalid HTTP Action:" + httpAction);
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
    body: body,
  };
}

export interface NamedValue {
  readonly name: string;
  readonly value: any;
}

export interface HTTPRequest {
  readonly url: string;
  readonly method: Method;
  readonly queryParams: ReadonlyArray<NamedValue>;
  readonly headers: any;
  readonly body: any;
}

function applyPathParams(url: string, params: ReadonlyArray<NamedValue>): string {
  let updatedURL = url;

  params.forEach((pathParam: NamedValue) => {
    updatedURL = updatedURL.replace("{" + pathParam.name + "}", pathParam.value);
  });

  return updatedURL;
}

function applyQueryParams(url: string, params: ReadonlyArray<NamedValue>): string {
  if (params.length > 0) {
    const queryPairs = params.map((param: NamedValue) => {
      return param.name + "=" + param.value;
    });

    return url + "?" + queryPairs.join("&");
  } else {
    return url;
  }
}

function toHash(values: ReadonlyArray<NamedValue>): any {
  const hash: any = {};

  values.forEach((value: NamedValue) => {
    hash[value.name] = value.value;
  });

  return hash;
}

export function createHTTPRequestFromScheme(httpAction: any, scheme: RequestScheme): HTTPRequest {

  const toParams = (annotation: NamedAnnotation): NamedValue => {
    return {
      name: annotation.name,
      value: annotation.propertyAccessor.readValue(httpAction),
    };
  };

  const pathParams: NamedValue[] = scheme.pathParams.map(toParams);
  const queryParams: NamedValue[] = scheme.queryParams.map(toParams);
  const headers: any = toHash(scheme.requestHeaders.map(toParams));
  const formFields: NamedValue[] = scheme.formFields.map(toParams);

  let body = scheme.body != null ? scheme.body.propertyAccessor.readValue(httpAction) : null;

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
    body: body,
  };
}

export function createHTTPRequestFromAction(httpAction: any): HTTPRequest {
  const scheme = parseHTTPAction(httpAction);
  return createHTTPRequestFromScheme(httpAction, scheme);
}

export function HttpAction(url: string, method: Method = "GET"): ClassDecorator {
  return (target: any) => {

    let metadata = Reflect.getMetadata(metaKey, target);

    if (!metadata) {
      metadata = {
        annotations: {},
      };
    }

    metadata.url = url;
    metadata.method = method;

    Reflect.defineMetadata(metaKey, metadata, target);

    return action(target);
  };
}
