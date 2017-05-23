import { BodyAnnotation, FieldAnnotation, PathParamAnnotation, QueryAnnotation, RequestHeaderAnnotation, ResponseHeaderAnnotation } from "./HTTPAnnotation";
export * from "./HTTPAnnotation";
export declare type Method = "GET" | "POST" | "PUT" | "DELETE" | "HEAD";
export declare const metaKey = "META::HTTPAction";
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
export declare function isHTTPAction(action: any): boolean;
export declare function parseHTTPAction(action: any): RequestScheme;
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
export declare function createHTTPRequestFromScheme(action: any, scheme: RequestScheme): HTTPRequest;
export declare function createHTTPRequestFromAction(action: any): HTTPRequest;
export declare function HttpAction(url: string, method?: Method): ClassDecorator;
