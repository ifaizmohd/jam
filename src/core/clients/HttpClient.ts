import { IHTTPClient } from "../../types/clients/httpClient.types";
import { request } from "../handlers/RequestHandler";

/**
 * HTTP client implementation for making web requests using the Fetch API
 * @class
 * @implements {IHTTPClient}
 * @remarks
 * - Centralized error handling through request method
 * - Supports all standard HTTP methods
 * - Automatically handles request/response lifecycle
 * @example
 * const client = new HTTPClient();
 * const response = await client.get('https://api.example.com/data');
 */
export class HTTPClient implements IHTTPClient {
  /**
   * Execute a GET request
   * @param {string} endpoint - URL endpoint to request
   * @param {RequestInit} options - Fetch configuration options
   * @returns {Promise<Response>} HTTP response
   * @throws {HTTPError} When request fails or returns non-2xx status
   * @example
   * await client.get('/users', {
   *   headers: { 'Accept': 'application/json' }
   * });
   */
  public async get(endpoint: string, options: RequestInit): Promise<Response> {
    return await request(endpoint, "GET", options);
  }

  /**
   * Execute a POST request
   * @param {string} endpoint - URL endpoint to request
   * @param {RequestInit} options - Fetch configuration options
   * @param {any} [body] - Request body payload
   * @returns {Promise<Response>} HTTP response
   * @throws {HTTPError} When request fails or returns non-2xx status
   * @devnote
   * - Content-Type header defaults to 'application/json' if not provided
   * - Body will be stringified if object provided
   */
  public async post(
    endpoint: string,
    options: RequestInit,
    body?: any
  ): Promise<Response> {
    return await request(endpoint, "POST", options, body);
  }

  /**
   * Execute a PUT request
   * @param {string} endpoint - URL endpoint to request
   * @param {RequestInit} options - Fetch configuration options
   * @param {any} [body] - Request body payload
   * @returns {Promise<Response>} HTTP response
   * @throws {HTTPError} When request fails or returns non-2xx status
   * @remarks
   * Suitable for full resource updates
   */
  public async put(
    endpoint: string,
    options: RequestInit,
    body?: any
  ): Promise<Response> {
    return await request(endpoint, "PUT", options, body);
  }

  /**
   * Execute a DELETE request
   * @param {string} endpoint - URL endpoint to request
   * @param {RequestInit} options - Fetch configuration options
   * @returns {Promise<Response>} HTTP response
   * @throws {HTTPError} When request fails or returns non-2xx status
   * @example
   * await client.delete('/users/123');
   */
  public async delete(
    endpoint: string,
    options: RequestInit
  ): Promise<Response> {
    return await request(endpoint, "DELETE", options);
  }

  /**
   * Execute a PATCH request
   * @param {string} endpoint - URL endpoint to request
   * @param {RequestInit} options - Fetch configuration options
   * @param {any} [body] - Request body payload
   * @returns {Promise<Response>} HTTP response
   * @throws {HTTPError} When request fails or returns non-2xx status
   * @remarks
   * Suitable for partial resource updates
   */
  public async patch(
    endpoint: string,
    options: RequestInit,
    body?: any
  ): Promise<Response> {
    return await request(endpoint, "PATCH", options, body);
  }
}
