import { ActionDispatcher, ActionExecutor, StateProvider, ActionHolder, BaseAction, IService } from "janet-ts";
import { createHTTPRequestFromAction, isHTTPAction } from "../action/RestAction";
import { APICallWrapper, APIClient, ResponseMapper } from "./APIClient";
import { JSONSerializer } from "./ContentCodec";

export type TokenProvider = () => string | null;

export class RestService implements IService {

  private readonly apiClient: APIClient;

  constructor(baseURL: string, private tokenProvider: TokenProvider, responseMapper: ResponseMapper, apiCallWrapper?: APICallWrapper) {
    this.apiClient = new APIClient(baseURL, new JSONSerializer(), responseMapper, apiCallWrapper);
  }

  public connect(dispatcher: ActionDispatcher, executor: ActionExecutor, stateProvider: StateProvider): void {
    // Empty
  }

  public dispatch(actionHolder: ActionHolder<BaseAction<any>, any>): Promise<any> {
    const request = createHTTPRequestFromAction(actionHolder.action);

    const url = request.url;
    const method = request.method;
    const body = request.body;
    const headers: any = request.headers;

    headers["Accept"] = headers["Accept"] || "application/json";
    headers["Content-Type"] = headers["Content-Type"] || "application/json";

    const skipAuth = request.headers["Accept"] !== "application/json";

    const token = this.tokenProvider();
    if (token && !skipAuth) {
      headers["Authorization"] = token;
    }

    return this.apiClient.fetch(url, method, headers, body).then((response) => {
      return response.payload;
    });
  }

  public accepts(action: any): boolean {
    return isHTTPAction(action);
  }
}
