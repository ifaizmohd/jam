import { HeaderConfig } from "../../types/header/Header.types";

/**
 * Collection of common header configurations for HTTP requests
 * @namespace
 * @example
 * // Create a factory with JSON presets
 * const factory = new HeaderFactory(HeaderPresets.json());
 *
 * // Add authentication to existing config
 * factory.setDefaultHeaders(HeaderPresets.bearerToken('eyJhbGci...'));
 */
export const HeaderPresets = {
  /**
   * Generates headers for JSON content negotiation
   * @returns {HeaderConfig} Headers for JSON API requests
   * @remarks
   * - Sets both Content-Type and Accept headers
   * - Suitable for REST APIs and JSON payloads
   * @example
   * fetch('/api', {
   *   headers: HeaderPresets.json()
   * })
   */
  json(): HeaderConfig {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  },

  /**
   * Generates headers for multipart form data submissions
   * @returns {HeaderConfig} Headers for file uploads/form submissions
   * @remarks
   * - Used with FormData body content
   * - Browser will automatically set boundary parameter
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/FormData | MDN FormData}
   * @example
   * const form = new FormData();
   * fetch('/upload', {
   *   method: 'POST',
   *   headers: HeaderPresets.formData(),
   *   body: form
   * })
   */
  formData(): HeaderConfig {
    return {
      "Content-Type": "multipart/form-data",
    };
  },

  /**
   * Generates Authorization header with Bearer token
   * @param {string} token - Authentication token (typically JWT)
   * @returns {HeaderConfig} Authorization header configuration
   * @throws {Error} If token is empty
   * @remarks
   * - Implements RFC 6750 Bearer Token specification
   * - Always use HTTPS with bearer tokens
   * @see {@link https://tools.ietf.org/html/rfc6750 | RFC 6750}
   * @example
   * // Secure token handling
   * const token = await getAuthToken();
   * factory.setDefaultHeaders(HeaderPresets.bearerToken(token));
   */
  bearerToken(token: string): HeaderConfig {
    if (!token.trim()) {
      throw new Error("Bearer token cannot be empty");
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  },
};
