import { QueryParams } from "./urlParser/urlParser.types";

export interface Url {
  endpoint: string;
  queryParams?: QueryParams;
  baseUrl?: string;
}
