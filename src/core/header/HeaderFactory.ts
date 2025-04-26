import { Headers } from "cross-fetch";
import { HeaderConfig, HeaderValidator } from "../../types/header/Header.types";

export class HeaderFactory {
  /**
   * Internal store for default headers that will be included in every request
   * @private
   */
  private defaultHeaders: Headers;

  /**
   * Collection of custom validation functions that headers must pass
   * @private
   */
  private customValidators: HeaderValidator[] = [];

  /**
   * Creates a HeaderFactory instance
   * @param initialHeaders - Initial default headers to be included in all requests
   * @example
   * new HeaderFactory({ 'Content-Type': 'application/json' })
   */
  constructor(initialHeaders: HeaderConfig = {}) {
    this.defaultHeaders = new Headers(initialHeaders);
  }

  /**
   * Permanently sets default headers that will be included in all subsequent requests
   * @param headers - Key/value pairs of headers to set
   * @remarks
   * This merges with existing default headers, overwriting values for existing keys
   * @example
   * setDefaultHeaders({ 'Authorization': 'Bearer token' })
   */
  public setDefaultHeaders(headers: HeaderConfig): void {
    Object.entries(headers).forEach(([name, value]) => {
      this.defaultHeaders.set(name, value);
    });
  }

  /**
   * Registers a custom validation function for headers
   * @param validator - Validation function that throws on invalid headers
   * @example
   * addValidator(headers => {
   *   if (!headers.has('X-CSRF')) throw Error('CSRF token required')
   * })
   */
  public addValidator(validator: HeaderValidator): void {
    this.customValidators.push(validator);
  }

  /**
   * Creates merged headers combining defaults with request-specific headers
   * @param headers - Optional request-specific headers to merge
   * @returns Final Headers object ready for HTTP requests
   * @throws {Error} When header validation fails
   * @devnote
   * - Merging follows fetch API header merging semantics
   * - Request-specific headers override default headers with same names
   */
  public create(headers?: HeaderConfig): Headers {
    // Start with clone of default headers to prevent mutation
    const merged = new Headers(this.defaultHeaders);

    // Merge request-specific headers using set() to override defaults
    if (headers) {
      Object.entries(headers).forEach(([name, value]) => {
        merged.set(name, value);
      });
    }

    // Validate before returning to ensure headers meet requirements
    this.validateHeaders(merged);

    return merged;
  }

  /**
   * Creates an independent clone of the factory with current configuration
   * @returns New HeaderFactory instance with copied configuration
   * @devnote
   * - Useful for creating specialized factories without affecting the original
   * - Clone maintains separate default headers and validators
   */
  public clone(): HeaderFactory {
    const clone = new HeaderFactory();
    // Deep copy headers to prevent reference sharing
    clone.defaultHeaders = new Headers(this.defaultHeaders);
    // Shallow copy validators array (functions are reference-safe)
    clone.customValidators = [...this.customValidators];
    return clone;
  }

  /**
   * Validates headers against all registered validation rules
   * @param headers - Headers instance to validate
   * @throws {Error} When any validation fails
   * @private
   * @devnote
   * - First runs built-in validations, then custom validators
   * - Validation stops on first failure (throws immediately)
   */
  private validateHeaders(headers: Headers): void {
    // Built-in validations - always enforced
    if (!this.isValidHeaderNames(headers)) {
      throw new Error("Invalid header names detected");
    }

    // Custom validations - additional user-defined checks
    this.customValidators.forEach((validator) => validator(headers));
  }

  /**
   * Validates header names against RFC 7230 specification
   * @param headers - Headers to check
   * @returns true if all header names are valid
   * @private
   * @see RFC 7230 Section 3.2 - Header Field Syntax
   * @devnote
   * - Allows visible ASCII chars except delimiters: ()<>@,;:\"/[]?={} \t
   * - Regex: /^[a-zA-Z0-9!#$%&'*+-.^_`|~]+$/
   */
  private isValidHeaderNames(headers: Headers): boolean {
    const headerNames = Array.from(headers.keys());
    return headerNames.every((name) =>
      /^[a-zA-Z0-9!#$%&'*+-.^_`|~]+$/.test(name)
    );
  }
}
