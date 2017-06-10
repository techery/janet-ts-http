import {ActionDispatcher, ActionExecutor, ActionHolder, BaseAction, IService} from "janet-ts";
import {createHTTPRequestFromAction, isHTTPAction} from "../action/RestAction";
import {APIClient} from "./APIClient";
import {JSONDeserializer, JSONSerializer} from "./ContentCodec";

export type TokenProvider = () => string | null;

export class RestService implements IService {


  apiClient: APIClient = new APIClient(new JSONSerializer(), new JSONDeserializer());

  constructor(baseURL: string, private tokenProvider: TokenProvider) {
    this.apiClient.baseURL = baseURL;
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
    }).catch((error) => {
      return error;
    });
  }

  accepts(action: any): boolean {
    return isHTTPAction(action);
  }
}
