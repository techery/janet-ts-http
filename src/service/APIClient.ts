import "whatwg-fetch";
import {Deserializer, Serializer} from "./ContentCodec";

export interface APIResponse {
  statusCode: number;
  payload: any;
}

class APIError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class APIClient {

  public baseURL?: string = undefined;

  constructor(private serializer: Serializer,
              private deserializer: Deserializer) {
  }

  buildURL(endpoint: string): string {
    return this.baseURL + endpoint;
  }

  fetch(url: string, method: string, headers: any, body?: any): Promise<APIResponse> {
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
          throw new APIError(response.status, payload.error)
        }
      });
    });
  }
}
