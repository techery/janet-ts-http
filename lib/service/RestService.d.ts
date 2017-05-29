import { ActionHolder, BaseAction, IService } from "janet-ts";
import { APIClient } from "./APIClient";
export declare type TokenProvider = () => string | null;
export declare class RestService implements IService {
    private tokenProvider;
    dispatcher: any;
    apiClient: APIClient;
    constructor(baseURL: string, tokenProvider: TokenProvider);
    dispatch(actionHolder: ActionHolder<BaseAction<any>, any>, dispatcher: any): void;
    accepts(action: any): boolean;
}
