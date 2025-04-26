import { InvalidUrlError } from "../../error/InvalidUrlError";
import {
  Encryptor,
  QueryParams,
  UrlParser,
} from "../../types/urlParser/urlParser.types";
import { BasicUrlParser } from "../urlParser/BasicUrlParser";

/**
 * Core URL handling component that combines parsing, construction, and optional encryption
 * @class
 * @example
 * // Basic usage
 * const handler = new UrlHandler();
 * const url = handler.parse('https://example.com');
 *
 * // With custom parser and encryption
 * const secureHandler = new UrlHandler(new AdvancedParser(), new AESEncryptor());
 */
export class UrlHandler {
  private parser: UrlParser;
  private encryptor?: Encryptor;

  /**
   * Creates a UrlHandler instance
   * @param {UrlParser} [parser=new BasicUrlParser()] - URL parsing strategy
   * @param {Encryptor} [encryptor] - Optional URL encryption module
   * @example
   * // Custom configuration
   * new UrlHandler(new CustomParser(), new Base64Encryptor());
   */
  constructor(parser: UrlParser = new BasicUrlParser(), encryptor?: Encryptor) {
    this.parser = parser;
    this.encryptor = encryptor;
  }

  /**
   * Parses and constructs a URL object with optional query parameters
   * @param {string} url - URL string to parse (absolute or relative)
   * @param {string} [base] - Base URL required for relative URLs
   * @param {QueryParams} [queryParams] - Additional query parameters to apply
   * @returns {URL} Constructed URL object
   * @throws {InvalidUrlError} When URL construction fails
   * @example
   * // Relative URL with base
   * handler.parse('/products', 'https://api.example.com');
   *
   * // With query parameters
   * handler.parse('https://example.com', undefined, { page: '2', sort: 'desc' });
   */
  public parse(url: string, base?: string, queryParams?: QueryParams): URL {
    try {
      // Core parsing delegation to strategy implementation
      const urlObject = this.parser.parse(url, base);
      // Apply query parameters if provided
      if (queryParams) {
        urlObject.search = this.buildQueryString(queryParams);
      }
      // Optional encryption hook
      if (this.encryptor) {
        urlObject.hash = this.encryptor.encrypt(urlObject.href);
      }
      return urlObject;
    } catch (error) {
      throw new InvalidUrlError(
        `Failed to create URL: ${(error as Error).message}`
      );
    }
  }

  /**
   * Converts query parameters object to URL-safe string
   * @private
   * @param {QueryParams} params - Key/value pairs of query parameters
   * @returns {string} URL-encoded query string
   * @devnote
   * - Handles array values through multiple key assignments
   * - Uses URLSearchParams for proper encoding
   * - Maintains parameter order per ES6 Map specification
   */
  private buildQueryString(params: QueryParams): string {
    const searchParams = new URLSearchParams();
    Object.entries(params)?.forEach(([key, value]) => {
      // Handle array values by appending multiple entries
      searchParams.append(key, value.toString());
    });
    return searchParams.toString();
  }
}
