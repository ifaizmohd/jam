import { QueryParams } from "../urlParser/urlParser.types";

export interface IJamClient {
  configure(options: Record<string, string>): void;
  setBaseUrl(baseUrl: string): void;
  setHeaders(headers: Record<string, string>): void;
  setAccessToken(token: string): void;
  get(url: string, payload?: any, queryParams?: QueryParams): Promise<Response>;
  post(
    url: string,
    payload?: any,
    queryParams?: QueryParams
  ): Promise<Response>;
  put(url: string, payload: any, queryParams?: QueryParams): Promise<Response>;
  delete(
    url: string,
    payload?: any,
    queryParams?: QueryParams
  ): Promise<Response>;
  patch(
    url: string,
    payload?: any,
    queryParams?: QueryParams
  ): Promise<Response>;
}

export interface IJamClientConfigurations {
  baseUrl?: string;
  headers?: Record<string, string>;
  accessToken?: string;
}
