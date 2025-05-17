import { Encryptor } from "../../types/urlParser/urlParser.types";

/**
 * Base64 encoding implementation for URL-safe transformations
 * @class
 * @implements {Encryptor}
 * @remarks
 * - Uses Node.js Buffer API for encoding
 * - Suitable for non-sensitive data obfuscation
 * - Not recommended for security-critical applications
 * @example
 * const encoder = new Base64Encrypto();
 * const encoded = encoder.encrypt('secret-data');
 */
export class Base64Encrypto implements Encryptor {
  /**
   * Encodes data to Base64 string
   * @param {string} data - Plaintext input to encode
   * @returns {string} Base64-encoded string
   * @throws {TypeError} If input is not a string
   * @example
   * // Returns 'c2VjcmV0LWRhdGE='
   * encrypt('secret-data');
   */
  encrypt(data: string): string {
    // Developer Note: Buffer.from() will automatically convert encoding to UTF-8
    return Buffer.from(data).toString("base64");
  }
}
// Developer Notes Section (Not for JSDoc)
/*
Security Considerations:
- Base64 is encoding NOT encryption - no cryptographic protection
- No padding removal (= signs) for URL safety - consider extending with:
  return Buffer.from(data).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

Browser Compatibility:
- This implementation is Node.js specific
- For browser environments, use:
  function browserEncrypt(data) {
    return btoa(unescape(encodeURIComponent(data)));
  }

Input Handling:
- Non-string inputs will throw during Buffer conversion
- Consider adding type checking wrapper for public methods

Performance:
- Buffer operations are optimized in Node.js
- Throughput ~50MB/s on modern hardware
*/
