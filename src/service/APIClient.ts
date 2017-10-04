import "whatwg-fetch";
import {Deserializer, Serializer} from "./ContentCodec";

export interface APIResponse {
  statusCode: number;
  payload: any;
}

export class APIError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export type APICall = () => Promise<APIResponse>;

export interface APICallWrapper {
  runApiCall(call: APICall): Promise<APIResponse>;
}

const defaultAPICallWrapper: APICallWrapper = {
  runApiCall: (call: APICall) => {
    return call();
  }
};

export class APIClient {

  constructor(public baseURL: string,
              private serializer: Serializer,
              private deserializer: Deserializer,
              protected apiCallWrapper: APICallWrapper = defaultAPICallWrapper) {
  }

  public fetch(url: string, method: string, headers: any, body?: any): Promise<APIResponse> {
    return this.apiCallWrapper.runApiCall(() => {
      return this.execFetch(url, method, headers, body);
    });
  }

  private buildURL(endpoint: string): string {
    return this.baseURL + endpoint;
  }

  private execFetch(url: string, method: string, headers: any, body?: any): Promise<APIResponse> {
    let params: any = {
      method: method,
      mode: 'cors',
      headers: headers
    };

    if (method == "POST" || method == "PUT") {
      params.body = this.serializer.serialize(body);
    }

    return fetch(this.buildURL(url), params).then((response: any) => {
      return response.text().then((responseString: string) => {
        const payload = this.deserializer.deserialize(responseString);
        if (response.ok) {
          return {
            statusCode: response.status,
            payload: payload
          };
        } else {
          throw new APIError(payload.error, response.status);
        }
      });
    });
  }
}
