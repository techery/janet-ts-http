import "whatwg-fetch";
import { Deserializer, Serializer } from "./ContentCodec";
export interface APIResponse {
    statusCode: number;
    payload: any;
}
export declare class APIError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare type APICall = () => Promise<APIResponse>;
export interface APICallWrapper {
    runApiCall(call: APICall): Promise<APIResponse>;
}
export declare class APIClient {
    baseURL: string;
    private serializer;
    private deserializer;
    protected apiCallWrapper: APICallWrapper;
    constructor(baseURL: string, serializer: Serializer, deserializer: Deserializer, apiCallWrapper?: APICallWrapper);
    fetch(url: string, method: string, headers: any, body?: any): Promise<APIResponse>;
    private buildURL(endpoint);
    private execFetch(url, method, headers, body?);
}
