import { HttpError } from "../../error/HttpError";
import { HttpMethods } from "../../types/clients/httpClient.types";
import { IAPIResponse } from "../../types/handlers/ResponseHandler.types";
import { ResponseHandler } from "./ResponseHandler";

/**
 * Attempts to parse error information from HTTP responses
 * @param {Response} response - Fetch API response object
 * @returns {Promise<any>} Parsed error data (JSON, text, or null)
 * @remarks
 * - Prioritizes JSON parsing, falls back to text, then returns null
 * - Critical for error handling in non-2xx responses
 * @example
 * const errorData = await parseError(response);
 * console.error('API Error:', errorData);
 */
export async function parseError(response: Response): Promise<any> {
  try {
    return await response.json();
  } catch {
    try {
      return await response.text();
    } catch {
      /* Dev Note: Silent fail is intentional - some responses
       * might not have consumable body content */
      return null;
    }
  }
}

/**
 * Merges HTTP request configuration options
 * @param {HttpMethods} method - HTTP verb to use
 * @param {any} body - Request payload body
 * @param {RequestInit} options - Base fetch options
 * @returns {RequestInit} Merged request configuration
 * @devnote
 * - Method parameter takes precedence over options.method
 * - Does NOT handle Content-Type headers automatically
 * - Clone options to avoid mutation side effects
 */
export function parseOptions(
  method: HttpMethods,
  options: RequestInit
): RequestInit {
  const processedOptions: RequestInit = {
    ...options,
    method,
  };
  return processedOptions;
}

/**
 * Core HTTP request executor with error handling
 * @template T - Expected response type
 * @param {string} endpoint - Target URL endpoint
 * @param {HttpMethods} method - HTTP method
 * @param {RequestInit} options - Fetch configuration
 * @param {any} [body] - Request payload
 * @returns {Promise<T>} Parsed response data
 * @throws {HttpError} For non-2xx responses or network failures
 * @example
 * const data = await request<User>('/users/1', 'GET', {}, null);
 */
export async function request<T>(
  endpoint: string,
  method: HttpMethods,
  options: RequestInit
): Promise<IAPIResponse<T>> {
  try {
    const parsedOptions = parseOptions(method, options);
    const response = await fetch(endpoint, parsedOptions);
    return ResponseHandler(response);
  } catch (error) {
    if (error instanceof HttpError) throw error;
    // Network errors (DNS, CORS, offline, etc)
    throw new HttpError(0, `Network Error: ${(error as Error).message}`);
  }
}
