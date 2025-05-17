import { HttpError } from "../../error/HttpError";
import {
  Cookie,
  IAPIResponse,
  ResponseMeta,
} from "../../types/handlers/ResponseHandler.types";

/**
 * Parses "Set-Cookie" headers from response headers into structured Cookie objects
 * @param {Headers} headers - Fetch API Headers object containing response headers
 * @returns {Cookie[]} Array of parsed cookie objects
 * @throws {TypeError} If cookie parsing fails due to invalid format
 *
 * @example
 * const cookies = parseSetCookies(response.headers);
 *
 * @devnote
 * - Uses regex with negative lookbehind to handle commas in Expires dates
 * - Decodes URL-encoded cookie names and values
 * - Handles cookie attributes: Domain, Path, Expires, Max-Age, Secure, HttpOnly, SameSite
 * - Browser compatibility: The regex pattern uses lookbehind assertions which work in modern browsers
 */
function parseSetCookies(headers: Headers): Cookie[] {
  const cookies: Cookie[] = [];
  const setCookieHeader = headers.get("set-cookie");

  if (!setCookieHeader) return cookies;

  // Split cookies while ignoring commas in Expires dates
  setCookieHeader.split(/(?<!Expires=.*),\s*/).forEach((cookieStr) => {
    const [nameValue, ...attributes] = cookieStr
      .split(";")
      .map((s) => s.trim());

    // Handle empty cookie values
    const [name, value] = nameValue.split("=");

    const cookie: Cookie = {
      name: decodeURIComponent(name),
      value: decodeURIComponent(value || ""),
    };

    attributes.forEach((attr) => {
      const [key, val] = attr.split("=");
      const lowerKey = key.toLowerCase();

      switch (lowerKey) {
        case "domain":
          cookie.domain = val;
          break;
        case "path":
          cookie.path = val;
          break;
        case "expires":
          // Dev Note: Invalid dates will result in "Invalid Date"
          cookie.expires = new Date(val);
          break;
        case "max-age":
          // Convert seconds to milliseconds and add to current time
          cookie.expires = new Date(Date.now() + parseInt(val) * 1000);
          break;
        case "secure":
          cookie.secure = true;
          break;
        case "httponly":
          cookie.httpOnly = true;
          break;
        case "samesite":
          // Type assertion assumes proper SameSite values
          cookie.sameSite = val as Cookie["sameSite"];
          break;
      }
    });

    cookies.push(cookie);
  });

  return cookies;
}

/**
 * Handles fetch API response parsing with unified error handling
 * @template T - Expected type of the response body
 * @param {Response} response - Fetch API Response object
 * @returns {Promise<IAPIResponse<T>>} Promise resolving to parsed response data
 * @throws {HttpError} When response status is not OK (200-299)
 *
 * @example
 * try {
 *   const { body, meta } = await ResponseHandler<User>(response);
 * } catch (error) {
 *   if (error instanceof HttpError) {
 *     console.error('API Error:', error.response);
 *   }
 * }
 *
 * @devnote
 * - Content-Type detection is case-insensitive
 * - Fallback parsing order: JSON → Text → FormData → Blob → Text (fallback)
 * - Headers are normalized to lowercase keys for consistent access
 * - Includes full response metadata in both success and error cases
 */
export async function ResponseHandler<T>(
  response: Response
): Promise<IAPIResponse<T>> {
  const contentType = response.headers.get("content-type") || "";
  let body: any;

  try {
    // Handle different content types with appropriate parsing
    if (contentType.includes("application/json")) {
      body = await response.json();
    } else if (contentType.includes("text/")) {
      body = await response.text();
    } else if (contentType.includes("multipart/form-data")) {
      body = await response.formData();
    } else {
      // Fallback to Blob for binary data
      body = await response.blob();
    }
  } catch (error) {
    // Final fallback to text if all parsing fails
    body = await response.text();
  }

  // Normalize headers to lowercase keys
  const headers = Array.from(Object.entries(response.headers)).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key.toLowerCase()]: value,
    }),
    {}
  );

  // Parse cookies using shared utility
  const cookies = parseSetCookies(response.headers);

  // Build comprehensive metadata
  const meta: ResponseMeta = {
    url: response.url,
    type: response.type,
    redirected: response.redirected,
    headers,
    cookies,
  };

  // Throw structured error for non-2xx responses
  if (!response.ok) {
    throw new HttpError(response.status, response.statusText, {
      ...meta,
      body,
    });
  }

  return { body, headers, cookies, meta };
}
