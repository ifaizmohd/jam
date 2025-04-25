import { InvalidUrlError } from "../../error/InvalidUrlError";
import { UrlParser } from "../../types/urlParser/urlParser.types";

export class BasicUrlParser implements UrlParser {
  private isRelativeUrl(url: string): boolean {
    return url.startsWith("/");
  }
  parse(url: string, base?: string): URL {
    try {
      if (this.isRelativeUrl(url) && !base) {
        throw new InvalidUrlError(
          `Invalid URL: ${url}. Please provide the complete url else provide base url.`
        );
      }
      return new URL(url, base);
    } catch (error) {
      throw new InvalidUrlError(
        `Invalid URL: ${url}. ${(error as Error).message}`
      );
    }
  }
}
