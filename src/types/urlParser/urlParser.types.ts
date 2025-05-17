export interface UrlParser {
  parse(url: string, base?: string): URL;
}

export interface Encryptor {
  encrypt(data: string): string;
}

export type QueryParams = Record<string, string | string[] | number | boolean>;

export interface ParsedUrl {
  original: string;
  protocol: string;
  hostname: string;
  path: string;
  queryParams: QueryParams;
  encrypted?: string;
}
