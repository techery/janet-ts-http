import { ActionHolder, BaseAction, IService } from "janet-ts";
import { APIClient } from "./APIClient";
export declare type TokenProvider = () => string | null;
export declare class RestService implements IService {
    private tokenProvider;
    apiClient: APIClient;
    constructor(baseURL: string, tokenProvider: TokenProvider);
    setDispatcher(dispatcher: any): void;
    dispatch(actionHolder: ActionHolder<BaseAction<any>, any>): Promise<any>;
    accepts(action: any): boolean;
}
