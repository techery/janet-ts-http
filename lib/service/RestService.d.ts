import { IService, StatefulAction } from "janet-ts";
import { APIClient } from "./APIClient";
export declare type TokenProvider = () => string;
export declare class RestService implements IService {
    private tokenProvider;
    dispatcher: any;
    apiClient: APIClient;
    constructor(baseURL: string, tokenProvider: TokenProvider);
    setDispatcher(dispatcher: any): void;
    dispatch(action: StatefulAction<any>): void;
    accepts(action: any): boolean;
}
