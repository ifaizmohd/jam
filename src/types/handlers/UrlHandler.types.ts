import { QueryParams } from "../urlParser/urlParser.types";

export interface IUrlHandler {
  parse(endpoint: string, baseUrl?: string, queryParams?: QueryParams): URL;
}
