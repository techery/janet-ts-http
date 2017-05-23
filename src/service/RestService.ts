import {ActionState, IService, StatefulAction} from "janet-ts";
import {createHTTPRequestFromAction, isHTTPAction} from "../action/RestAction";
import {APIClient} from "./APIClient";
import {JSONDeserializer, JSONSerializer} from "./ContentCodec";

export class RestService implements IService {

  public apiToken: string | null = null;
  dispatcher: any = null;
  apiClient: APIClient = new APIClient(new JSONSerializer(), new JSONDeserializer());

  constructor(baseURL: string) {
    this.apiClient.baseURL = baseURL;
  }

  setDispatcher(dispatcher: any): void {
    this.dispatcher = dispatcher;
  }

  dispatch(action: StatefulAction<any>): void {

    this.dispatcher(action.set("state", ActionState.RUNNING));

    const request = createHTTPRequestFromAction(action);

    const url = request.url;
    const method = request.method;
    const body = request.body;
    const headers: any = request.headers;

    headers["Accept"] = "application/json";
    headers["Content-Type"] = "application/json";

    if (this.apiToken != null) {
      headers["Authorization"] = this.apiToken;
    }

    this.apiClient.fetch(url, method, headers, body).then((response) => {
      const resultAction = action.set("state", ActionState.FINISHED).set("result" as any, response.payload);
      this.dispatcher(resultAction);
    }).catch((error) => {
      const resultAction = action.set("state", ActionState.FAILED).set("error", error);
      this.dispatcher(resultAction);
    });
  }

  accepts(action: any): boolean {
    return isHTTPAction(action);
  }
}
