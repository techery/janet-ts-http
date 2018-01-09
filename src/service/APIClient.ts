/* tslint:disable:no-deep-module-imports */
// tslint:disable:max-params
import "whatwg-fetch";
import { Serializer } from "./ContentCodec";

export interface APIResponse {
  readonly statusCode: number;
  readonly payload: any;
}

export class APIError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class APIFormError implements Error {
  public readonly name: string;
  public readonly message: string;
  public readonly statusCode: number;
  public readonly fieldErrors: any;

  constructor(errors: any, statusCode: number) {
    this.message = "Form validation error";
    this.statusCode = statusCode;
    this.fieldErrors = errors;
  }

  public getByField(name: string): string {
    if (!this.fieldErrors) {
      return "";
    }

    const fieldError = this.fieldErrors[name];

    if (!fieldError) {
      return "";
    }

    return fieldError.map((message: string) => {
      return message;
    }).toString();
  }
}

export type APICall = () => Promise<APIResponse>;
export type APICallWrapper = (call: APICall) => Promise<APIResponse>;
export type ResponseMapper = (response: Response) => APIResponse | Promise<APIResponse>;

const defaultAPICallWrapper: APICallWrapper = (call: APICall) => {
  return call();
};

export class APIClient {
  constructor(public baseURL: string,
              private serializer: Serializer,
              private responseMapper: ResponseMapper,
              protected apiCallWrapper: APICallWrapper = defaultAPICallWrapper) {
  }

  public fetch(url: string, method: string, headers: any, body?: any): Promise<APIResponse> {
    return this.apiCallWrapper(() => {
      return this.execFetch(url, method, headers, body);
    });
  }

  private buildURL(endpoint: string): string {
    if (endpoint.startsWith("http")) {
      return endpoint;
    } else {
      return this.baseURL + endpoint;
    }
  }

  private execFetch(url: string, method: string, headers: any, body?: any): Promise<APIResponse> {
    const params: any = {
      method: method,
      mode: "cors",
      headers: headers,
      cache: "default",
    };

    if (method === "POST" || method === "PUT") {
      params.body = this.serializer.serialize(body);
    }

    return fetch(this.buildURL(url), params).then(this.responseMapper);
  }
}
