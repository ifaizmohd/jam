import { InvalidUrlError } from "../../error/InvalidUrlError";
import { UrlParser } from "../../types/urlParser/urlParser.types";

/**
 * Default URL parser implementation using the WHATWG URL API
 * @class
 * @implements {UrlParser}
 * @remarks
 * - Follows RFC 3986 URL specification
 * - Handles relative URLs when base is provided
 * - Validates URLs according to browser-standard rules
 * @example
 * const parser = new BasicUrlParser();
 * const absoluteUrl = parser.parse('https://example.com');
 * const relativeUrl = parser.parse('/products', 'https://api.example.com');
 */
export class BasicUrlParser implements UrlParser {
  /**
   * Determines if a URL string is relative
   * @private
   * @param {string} url - URL to check
   * @returns {boolean} True for relative paths starting with '/'
   * @devnote
   * - Simple heuristic that only checks leading slash
   * - Does not handle './' or '../' relative paths
   * - Consider using URL.canParse() for Node.js 18+ (see https://nodejs.org/api/url.html#urlcanparseinput-base)
   */
  private isRelativeUrl(url: string): boolean {
    return url.startsWith("/");
  }

  /**
   * Parses and validates a URL string
   * @param {string} url - URL to parse (absolute or relative)
   * @param {string} [base] - Base URL required for relative URLs
   * @returns {URL} Parsed URL object
   * @throws {InvalidUrlError} When parsing fails or relative URL lacks base
   * @example
   * // Absolute URL
   * parse('https://example.com');
   *
   * // Relative URL with base
   * parse('/products', 'https://api.example.com');
   */
  parse(url: string, base?: string): URL {
    try {
      // Validate relative URL requirements before native parsing
      if (this.isRelativeUrl(url) && !base) {
        throw new InvalidUrlError(
          `Invalid URL: ${url}. Please provide the complete url else provide base url.`
        );
      }
      // Leverage browser/Node.js built-in validation
      /* Dev Note: Using new URL() directly leverages the platform's
       * built-in validation that matches fetch() API behavior
       * https://developer.mozilla.org/en-US/docs/Web/API/URL/URL */
      return new URL(url, base);
    } catch (error) {
      // Preserve original error message for diagnostics
      /* Dev Note: Preserve original error message but wrap in
       * InvalidUrlError to maintain error type consistency
       * across different parser implementations */
      throw new InvalidUrlError(
        `Invalid URL: ${url}. ${(error as Error).message}`
      );
    }
  }
}
