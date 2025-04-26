export interface IHTTPClient {
  /**
   * Execute a GET request
   * @param endpoint API endpoint path
   * @param options Additional fetch options
   */
  get(endpoint: string, options?: RequestInit): Promise<Response>;

  /**
   * Execute a POST request
   * @param endpoint API endpoint path
   * @param body Request body payload
   * @param options Additional fetch options
   */
  post(endpoint: string, options: RequestInit, body?: any): Promise<Response>;

  /**
   * Execute a DELETE request
   * @param endpoint API endpoint path
   * @param options Additional fetch options
   */
  delete(endpoint: string, options?: RequestInit): Promise<Response>;

  /**
   * Execute a PATCH request
   * @param endpoint API endpoint path
   * @param body Request body payload
   * @param options Additional fetch options
   */
  patch(endpoint: string, options: RequestInit, body?: any): Promise<Response>;
}

export type HttpMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
