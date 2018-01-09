import "whatwg-fetch";
import { Serializer } from "./ContentCodec";
export interface APIResponse {
    readonly statusCode: number;
    readonly payload: any;
}
export declare class APIError extends Error {
    readonly statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare class APIFormError implements Error {
    readonly name: string;
    readonly message: string;
    readonly statusCode: number;
    readonly fieldErrors: any;
    constructor(errors: any, statusCode: number);
    getByField(name: string): string;
}
export declare type APICall = () => Promise<APIResponse>;
export declare type APICallWrapper = (call: APICall) => Promise<APIResponse>;
export declare type ResponseMapper = (response: Response) => APIResponse | Promise<APIResponse>;
export declare class APIClient {
    baseURL: string;
    private serializer;
    private responseMapper;
    protected apiCallWrapper: APICallWrapper;
    constructor(baseURL: string, serializer: Serializer, responseMapper: ResponseMapper, apiCallWrapper?: APICallWrapper);
    fetch(url: string, method: string, headers: any, body?: any): Promise<APIResponse>;
    private buildURL(endpoint);
    private execFetch(url, method, headers, body?);
}
