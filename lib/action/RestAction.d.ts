import { BodyAnnotation, FieldAnnotation, PathParamAnnotation, QueryAnnotation, RequestHeaderAnnotation, ResponseHeaderAnnotation } from "./HTTPAnnotation";
export * from "./HTTPAnnotation";
export declare type Method = "GET" | "POST" | "PUT" | "DELETE" | "HEAD";
export declare const metaKey = "META::HTTPAction";
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
export declare function isHTTPAction(httpAction: any): boolean;
export declare function parseHTTPAction(httpAction: any): RequestScheme;
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
export declare function createHTTPRequestFromScheme(httpAction: any, scheme: RequestScheme): HTTPRequest;
export declare function createHTTPRequestFromAction(httpAction: any): HTTPRequest;
export declare function HttpAction(url: string, method?: Method): ClassDecorator;
