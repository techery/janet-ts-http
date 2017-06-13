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
export declare class APIClient {
    private serializer;
    private deserializer;
    baseURL?: string;
    constructor(serializer: Serializer, deserializer: Deserializer);
    buildURL(endpoint: string): string;
    fetch(url: string, method: string, headers: any, body?: any): Promise<APIResponse>;
}
