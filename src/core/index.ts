import { ApiErrorHandler } from "../error/ApiError";
import { HttpMethods } from "../types/clients/httpClient.types";
import { Url } from "../types/index.types";
import headerFactory from "./header";
import { HeaderPresets } from "./header/HeaderPresets";
import UrlParser from "./urlParser";

const errorHandler = new ApiErrorHandler();

export async function constructApi(
  url: URL,
  payload?: any,
  header?: Headers,
  method?: HttpMethods
) {
  if (method) {
    const apiFunction = await import(
      `../core/HttpMethods/${method.trim().toLocaleLowerCase()}`
    );
    return apiFunction.default(url, { ...payload, ...header });
  }
  throw errorHandler.handle("Please provide the HTTP Method");
}

export async function constructHeaders(
  url: URL,
  payload?: any,
  headers?: Record<string, string>,
  method?: HttpMethods
) {
  return await constructApi(
    url,
    payload,
    headerFactory.create({ ...HeaderPresets.json(), ...headers }),
    method
  );
}

export async function constructUrl(
  url: Url,
  payload?: any,
  headers?: Record<string, string>,
  method?: HttpMethods
) {
  return await constructHeaders(
    UrlParser.parse(url.endpoint, url.baseUrl, url.queryParams),
    payload,
    headers,
    method
  );
}
