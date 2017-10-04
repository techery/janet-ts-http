import {ActionDispatcher, ActionExecutor, ActionHolder, BaseAction, IService} from "janet-ts";
import {createHTTPRequestFromAction, isHTTPAction} from "../action/RestAction";
import {APICallWrapper, APIClient} from "./APIClient";
import {JSONDeserializer, JSONSerializer} from "./ContentCodec";

export type TokenProvider = () => string | null;

export class RestService implements IService {

  private apiClient: APIClient;

  constructor(baseURL: string, private tokenProvider: TokenProvider, apiCallWrapper?: APICallWrapper) {
    this.apiClient = new APIClient(baseURL, new JSONSerializer(), new JSONDeserializer(), apiCallWrapper);
  }

  public connect(dispatcher: ActionDispatcher, executor: ActionExecutor): void {

  }

  dispatch(actionHolder: ActionHolder<BaseAction<any>, any>): Promise<any> {
    const request = createHTTPRequestFromAction(actionHolder.action);

    const url = request.url;
    const method = request.method;
    const body = request.body;
    const headers: any = request.headers;

    headers["Accept"] = "application/json";
    headers["Content-Type"] = "application/json";

    let token = this.tokenProvider();
    if (token) {
      headers["Authorization"] = token;
    }

    return this.apiClient.fetch(url, method, headers, body).then((response) => {
      return response.payload;
    });
  }

  accepts(action: any): boolean {
    return isHTTPAction(action);
  }
}
