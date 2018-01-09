import { ActionDispatcher, ActionExecutor, ActionHolder, BaseAction, IService } from "janet-ts";
import { APICallWrapper, ResponseMapper } from "./APIClient";
export declare type TokenProvider = () => string | null;
export declare class RestService implements IService {
    private tokenProvider;
    private readonly apiClient;
    constructor(baseURL: string, tokenProvider: TokenProvider, responseMapper: ResponseMapper, apiCallWrapper?: APICallWrapper);
    connect(dispatcher: ActionDispatcher, executor: ActionExecutor): void;
    dispatch(actionHolder: ActionHolder<BaseAction<any>, any>): Promise<any>;
    accepts(action: any): boolean;
}
