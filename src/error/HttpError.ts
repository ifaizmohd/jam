/**
 * Custom error class for handling HTTP errors with status codes and response data
 * @class
 * @extends {Error}
 * @remarks
 * - Distinguishes HTTP errors from generic Errors
 * - Captures full error context including status code and response body
 * - Essential for error handling middleware and API client error differentiation
 * @example
 * throw new HttpError(404, 'User not found', { userId: 123 });
 *
 * try {
 *   await fetchResource();
 * } catch (error) {
 *   if (error instanceof HttpError) {
 *     console.error(`API Error ${error.status}:`, error.data);
 *   }
 * }
 */
export class HttpError extends Error {
  /**
   * Creates an HttpError instance
   * @param {number} status - HTTP status code
   * @param {string} message - Human-readable error description
   * @param {any} [data] - Optional response data from server
   * @example
   * new HttpError(500, 'Internal Server Error', { traceId: 'abc123' })
   */
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    // Maintains proper prototype chain for TypeScript inheritance
    Object.setPrototypeOf(this, HttpError.prototype);
    /* Dev Note: Required for TypeScript when extending built-in classes
     * Ensures proper stack trace capture and instanceof checks */
  }
  /* Dev Notes:
   * 1. Status Codes: Consider adding helper methods like isClientError() { return this.status >= 400 && this.status < 500 }
   * 2. Data Safety: Be cautious about exposing sensitive server errors to end users
   * 3. Serialization: Add toJSON() method for logging/API responses
   * 4. Subclassing: Create specific errors like NotFoundError extends HttpError
   * 5. Error Codes: Consider adding machine-readable error code property
   */
}
// Additional Dev Notes (Non-JSDoc):
/*
Error Handling Best Practices:
- Always check error instanceof HttpError before accessing status/data
- Use status codes for conditional error handling logic
- Sanitize error data before exposing to clients
- Include error codes for translation/monitoring

Browser Compatibility:
- Works in all modern browsers and Node.js ≥10
- Polyfill needed for ES5 environments

Logging Considerations:
- Include status code in log metadata
- Redact sensitive data from error.data
- Capture full error context:
  { status, message, data, stack }

Testing Strategies:
- Verify instanceof checks
- Test status code propagation
- Validate data preservation
- Check stack trace integrity
*/
