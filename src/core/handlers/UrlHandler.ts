import { InvalidUrlError } from "../../error/InvalidUrlError";
import {
  Encryptor,
  QueryParams,
  UrlParser,
} from "../../types/urlParser/urlParser.types";
import { BasicUrlParser } from "../urlParser/BasicUrlParser";

export class UrlHandler {
  private parser: UrlParser;
  private encryptor?: Encryptor;

  constructor(parser: UrlParser = new BasicUrlParser(), encryptor?: Encryptor) {
    this.parser = parser;
    this.encryptor = encryptor;
  }

  //   in case of relative url like - /products, /search; base url is mandatory.
  public parse(url: string, base?: string, queryParams?: QueryParams): URL {
    try {
      // It gives us the URL object.
      const urlObject = this.parser.parse(url, base);
      if (queryParams) {
        urlObject.search = this.buildQueryString(queryParams);
      }
      return urlObject;
    } catch (error) {
      throw new InvalidUrlError(
        `Failed to create URL: ${(error as Error).message}`
      );
    }
  }

  private buildQueryString(params: QueryParams): string {
    const searchParams = new URLSearchParams();
    Object.entries(params)?.forEach(([key, value]) => {
      searchParams.append(key, value.toString());
    });
    return searchParams.toString();
  }
}

/**
 * relative url, queryParams{}, baseUrl -> complete url.
 * (relativeUrl, queryParams) -> baseUrl -> complete url.
 */
