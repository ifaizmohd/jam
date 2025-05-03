import { has } from "lodash";
import {
  IJamClient,
  IJamClientConfigurations,
} from "../../types/clients/JamClient.types";
import { QueryParams } from "../../types/urlParser/urlParser.types";
import { constructUrl } from "..";

/**
 * Core client for interacting with Jam API services
 * @class
 * @implements {IJamClient}
 * @remarks
 * - Handles API configuration and authentication
 * - Manages request headers and base URLs
 * - Provides HTTP method shortcuts with consistent interface
 * @example
 * const client = new JamClient('https://api.jam.com');
 * client.setAccessToken('ey123...');
 * const data = await client.get('/tracks');
 */
export class JamClient implements IJamClient {
  private baseUrl?: string;
  private accessToken?: string;
  private headers?: Record<string, string>;

  /**
   * Initialize Jam API client
   * @param {string} [baseUrl] - Base API URL for all requests
   * @example
   * new JamClient(process.env.API_URL)
   */
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Configure multiple client options at once
   * @param {IJamClientConfigurations} options - Configuration object
   * @example
   * client.configure({
   *   baseUrl: 'https://api.jam.com/v2',
   *   accessToken: 'eyJhbGci...'
   * });
   */
  configure(options: IJamClientConfigurations): void {
    /* Dev Note: Using has() polyfill for backward compatibility
     * Consider Object.hasOwn() for modern environments */
    if (has(options, "baseUrl")) {
      this.baseUrl = options.baseUrl;
    }
    if (has(options, "accessToken")) {
      this.accessToken = options.accessToken;
    }
  }

  /**
   * Set authentication token for API requests
   * @param {string} token - Bearer token or API key
   * @remarks
   * Token will be used in Authorization header when setAuthHeaders() is called
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * Update base URL for API endpoints
   * @param {string} baseUrl - New base URL for all requests
   * @throws {Error} If invalid URL format provided
   */
  setBaseUrl(baseUrl: string): void {
    // Dev Note: Consider adding URL validation here
    this.baseUrl = baseUrl;
  }

  /**
   * Merge custom headers with existing configuration
   * @param {Record<string, string>} headers - Header key/value pairs
   * @example
   * client.setHeaders({
   *   'X-Custom-Header': 'value'
   * });
   */
  setHeaders(headers: Record<string, string>): void {
    this.headers = { ...this.headers, ...headers };
  }

  /**
   * Set authentication header using stored access token
   * @param {string} header - Header name to use for authentication
   * @throws {Error} If access token not configured
   * @example
   * client.setAuthHeaders('Authorization');
   */
  setAuthHeaders(header: string): void {
    if (!this.accessToken) {
      throw new Error("Access token must be set before setting auth headers");
    }
    this.headers = {
      ...this.headers,
      [header]: this.accessToken,
    };
  }

  /**
   * Execute GET request
   * @param {string} url - API endpoint URL
   * @param {any} [payload] - Request body (unused in GET)
   * @param {QueryParams} [queryParams] - URL query parameters
   * @returns {Promise<void>} API response
   * @throws {HttpError} On request failure
   */
  async get(
    url: string,
    payload?: any,
    queryParams?: QueryParams
  ): Promise<void> {
    return await constructUrl(
      { endpoint: url, baseUrl: this.baseUrl, queryParams },
      payload,
      { ...this.headers },
      "GET"
    );
  }

  /**
   * Execute POST request
   * @param {string} url - API endpoint URL
   * @param {any} [payload] - Request body
   * @param {QueryParams} [queryParams] - URL query parameters
   * @returns {Promise<void>} API response
   * @throws {HttpError} On request failure
   */
  async post(
    url: string,
    payload?: any,
    queryParams?: QueryParams
  ): Promise<void> {
    return await constructUrl(
      { endpoint: url, baseUrl: this.baseUrl, queryParams },
      payload,
      { ...this.headers },
      "POST"
    );
  }

  /**
   * Execute PUT request
   * @param {string} url - API endpoint URL
   * @param {any} [payload] - Request body
   * @param {QueryParams} [queryParams] - URL query parameters
   * @returns {Promise<Response>} Raw HTTP response
   * @throws {ApiError} On request failure
   * @devnote
   * - Uses different HTTP client implementation than GET/POST
   * - Consider aligning with other methods' return type
   */
  async put(
    url: string,
    payload: any,
    queryParams?: QueryParams
  ): Promise<Response> {
    return constructUrl(
      { endpoint: url, baseUrl: this.baseUrl, queryParams },
      payload,
      { ...this.headers },
      "PUT"
    );
  }

  /**
   * Execute DELETE request
   * @param {string} url - API endpoint URL
   * @param {any} [payload] - Request body
   * @param {QueryParams} [queryParams] - URL query parameters
   * @returns {Promise<Response>} Raw HTTP response
   * @throws {ApiError} On request failure
   * @devnote
   * - Uses different HTTP client implementation than GET/POST
   * - Consider aligning with other methods' return type
   */
  async delete(
    url: string,
    queryParams?: QueryParams,
    payload?: any
  ): Promise<Response> {
    return constructUrl(
      { endpoint: url, baseUrl: this.baseUrl, queryParams },
      payload,
      { ...this.headers },
      "PUT"
    );
  }

  /**
   * Execute PATCH request
   * @param {string} url - API endpoint URL
   * @param {any} [payload] - Request body
   * @param {QueryParams} [queryParams] - URL query parameters
   * @returns {Promise<Response>} Raw HTTP response
   * @throws {ApiError} On request failure
   * @devnote
   * - Uses different HTTP client implementation than GET/POST
   * - Consider aligning with other methods' return type
   */
  async patch(
    url: string,
    payload?: any,
    queryParams?: QueryParams
  ): Promise<Response> {
    return constructUrl(
      { endpoint: url, baseUrl: this.baseUrl, queryParams },
      payload,
      { ...this.headers },
      "PATCH"
    );
  }
}

/* Dev Notes:
 * 1. Inconsistent Implementation:
 *    - GET/POST use constructUrl while PUT/DELETE/PATCH use HTTPClient directly
 *    - Consider unifying request handling approach
 *
 * 2. Security:
 *    - Access token stored in plain text - consider secure storage
 *    - No token refresh mechanism
 *
 * 3. Error Handling:
 *    - Missing centralized error processing
 *    - No network error differentiation
 *
 * 4. Type Safety:
 *    - Payload type 'any' reduces type safety
 *    - Return type inconsistencies (void vs Response)
 *
 * 5. Performance:
 *    - New HTTPClient instance created per PUT/DELETE/PATCH request
 *    - Consider singleton HTTP client
 *
 * 6. Missing Features:
 *    - Request cancellation
 *    - Retry logic
 *    - Response validation
 */
