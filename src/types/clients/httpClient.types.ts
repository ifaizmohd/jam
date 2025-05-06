import { IAPIResponse } from "../handlers/ResponseHandler.types";

export interface IHTTPClient {
  /**
   * Execute a GET request
   * @param endpoint API endpoint path
   * @param options Additional fetch options
   */
  get<T>(endpoint: string, options?: RequestInit): Promise<IAPIResponse<T>>;

  /**
   * Execute a POST request
   * @param endpoint API endpoint path
   * @param body Request body payload
   * @param options Additional fetch options
   */
  post<T>(
    endpoint: string,
    options: RequestInit,
    body?: any
  ): Promise<IAPIResponse<T>>;

  /**
   * Execute a DELETE request
   * @param endpoint API endpoint path
   * @param options Additional fetch options
   */
  delete<T>(endpoint: string, options?: RequestInit): Promise<IAPIResponse<T>>;

  /**
   * Execute a PATCH request
   * @param endpoint API endpoint path
   * @param body Request body payload
   * @param options Additional fetch options
   */
  patch<T>(
    endpoint: string,
    options: RequestInit,
    body?: any
  ): Promise<IAPIResponse<T>>;
}

export type HttpMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
