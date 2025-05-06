/**
 * Represents metadata about an HTTP response.
 * This includes information about the request/response cycle that isn't part of the actual response body.
 *
 * @interface ResponseMeta
 * @property {string} url - The final URL after any redirects. This may differ from the request URL if redirects were followed.
 * @property {ResponseType} type - The type of the response (e.g., 'basic', 'cors', 'error').
 * @property {boolean} redirected - Indicates whether the response was the result of a redirect.
 * @property {Record<string, string>} headers - A key-value pair of response headers.
 * @property {Cookie[]} cookies - An array of cookies set by the response.
 *
 * @note The `url` property is particularly useful for debugging redirect chains.
 * @see {@link IAPIResponse} for the complete response structure that includes this metadata.
 */
export interface ResponseMeta {
  url: string;
  type: ResponseType;
  redirected: boolean;
  headers: Record<string, string>;
  cookies: Cookie[];
}

/**
 * Represents an HTTP cookie with all relevant attributes.
 * This interface models the full cookie specification including security attributes.
 *
 * @interface Cookie
 * @property {string} name - The name of the cookie.
 * @property {string} value - The value of the cookie.
 * @property {string} [domain] - The domain the cookie is valid for. Optional.
 * @property {string} [path] - The path the cookie is valid for. Optional.
 * @property {Date} [expires] - The expiration date of the cookie. Optional.
 * @property {boolean} [secure] - Indicates if the cookie should only be transmitted over secure protocols. Optional.
 * @property {boolean} [httpOnly] - Indicates if the cookie is inaccessible to client-side scripts. Optional.
 * @property {"Strict" | "Lax" | "None"} [sameSite] - Controls whether the cookie is sent with cross-site requests. Optional.
 *
 * @note When `secure` is true, the cookie will only be sent over HTTPS.
 * @warning Cookies with `httpOnly` true cannot be accessed via JavaScript for security reasons.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies for complete cookie documentation.
 */
export interface Cookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: Date;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

/**
 * Represents a complete API response with typed body and metadata.
 * This is a generic interface that can be used for all API responses in the application.
 *
 * @interface IAPIResponse
 * @template T - The type of the response body.
 * @property {T} body - The parsed response body. Type varies by endpoint.
 * @property {Record<string, string>} headers - Response headers as key-value pairs.
 * @property {Cookie[]} cookies - Cookies set by the response.
 * @property {ResponseMeta} meta - Additional metadata about the response.
 *
 * @example
 * // Example usage with a user data response:
 * const userResponse: IAPIResponse<User> = await getUser();
 * console.log(userResponse.body.name); // Type-safe access to User properties
 *
 * @note This interface provides a consistent way to handle all API responses while maintaining type safety.
 * @see {@link ResponseMeta} for details about the metadata structure.
 */
export interface IAPIResponse<T> {
  body: T;
  headers: Record<string, string>;
  cookies: Cookie[];
  meta: ResponseMeta;
}
