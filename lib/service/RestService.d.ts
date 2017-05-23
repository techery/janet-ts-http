import { IService, StatefulAction } from "janet-ts";
import { APIClient } from "./APIClient";
export declare class RestService implements IService {
    apiToken: string | null;
    dispatcher: any;
    apiClient: APIClient;
    constructor(baseURL: string);
    setDispatcher(dispatcher: any): void;
    dispatch(action: StatefulAction<any>): void;
    accepts(action: any): boolean;
}
