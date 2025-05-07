/**
 * @file Provides core API construction utilities for making HTTP requests.
 * Includes methods for building requests with proper headers, URL formatting, and error handling.
 * Uses a centralized error handler for consistent error reporting.
 */
import { ApiErrorHandler } from "../../error/ApiError";
import { HttpMethods } from "../../types/clients/httpClient.types";
import { Url } from "../../types/index.types";
import { headerFactory } from "../header";
import { HeaderPresets } from "../header/HeaderPresets";
import { urlParser } from "../urlParser";
import { ImportApiFunction } from "../../utils/apiFunction.utils";

const errorHandler = new ApiErrorHandler();

/**
 * Core function to construct and execute an API request.
 * Dynamically imports and uses the appropriate HTTP method function.
 *
 * @async
 * @function constructApi
 * @param {URL} url - The fully constructed URL object for the request
 * @param {*} [payload] - The request payload (optional)
 * @param {Headers} [header] - Headers to include with the request (optional)
 * @param {HttpMethods} [method] - HTTP method (GET, POST, PUT, etc.)
 * @returns {Promise<any>} The response from the API call
 * @throws Will throw a handled error if no method is provided or if the request fails
 *
 * @note This is the lowest level function in the API construction chain
 * @warning Dynamic import of HTTP methods assumes specific naming conventions
 * @example
 * const response = await constructApi(new URL('https://api.example.com'), { id: 1 }, new Headers(), 'GET');
 */
export async function constructApi(
  url: URL,
  payload?: any,
  header?: Headers,
  method?: HttpMethods
): Promise<any> {
  try {
    if (method) {
      const apiFunction = await ImportApiFunction(method.toLowerCase());
      const options: RequestInit = {
        headers: header,
        body: payload,
      };
      return apiFunction.default(url, options);
    }
    throw errorHandler.handle("Please provide the HTTP Method");
  } catch (e) {
    throw errorHandler.handle("Error occurred in construct API method:: " + e);
  }
}

/**
 * Constructs an API request with properly formatted headers.
 * Merges default JSON headers with any custom headers provided.
 *
 * @async
 * @function constructHeaders
 * @param {URL} url - The target URL for the request
 * @param {*} [payload] - The request payload (optional)
 * @param {Record<string, string>} [headers] - Additional headers to merge (optional)
 * @param {HttpMethods} [method] - HTTP method (GET, POST, PUT, etc.)
 * @returns {Promise<any>} The response from the API call
 *
 * @note Automatically applies JSON content-type headers by default
 * @see {@link constructApi} for the underlying implementation
 * @example
 * const response = await constructHeaders(new URL('https://api.example.com'), { data: 'test' }, { 'X-Custom': 'value' }, 'POST');
 */
export async function constructHeaders(
  url: URL,
  payload?: any,
  headers?: Record<string, string>,
  method?: HttpMethods
) {
  return await constructApi(
    url,
    payload,
    headerFactory.create({ ...HeaderPresets.json(), ...headers }),
    method
  );
}

/**
 * Highest-level API construction function that handles URL parsing.
 * Takes endpoint configuration and constructs the complete request.
 *
 * @async
 * @function constructUrl
 * @param {Url} url - Object containing endpoint configuration
 * @param {string} url.endpoint - The API endpoint path
 * @param {string} url.baseUrl - The base URL for the API
 * @param {object} url.queryParams - Query parameters to include
 * @param {*} [payload] - The request payload (optional)
 * @param {Record<string, string>} [headers] - Additional headers to merge (optional)
 * @param {HttpMethods} [method] - HTTP method (GET, POST, PUT, etc.)
 * @returns {Promise<any>} The response from the API call
 *
 * @note This is the most commonly used function in the API construction chain
 * @see {@link constructHeaders} for the next step in the chain
 * @example
 * const response = await constructUrl(
 *   { endpoint: '/users', baseUrl: 'https://api.example.com', queryParams: { page: 2 } },
 *   null,
 *   { 'Authorization': 'Bearer token' },
 *   'GET'
 * );
 */
export async function constructUrl(
  url: Url,
  payload?: any,
  headers?: Record<string, string>,
  method?: HttpMethods
) {
  return await constructHeaders(
    urlParser.parse(url.endpoint, url.baseUrl, url.queryParams),
    payload,
    headers,
    method
  );
}
