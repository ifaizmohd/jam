import { ApiErrorHandler } from "../error/ApiError";
import { HttpMethods } from "../types/clients/httpClient.types";
import { Url } from "../types/index.types";
import { headerFactory } from "./header";
import { HeaderPresets } from "./header/HeaderPresets";
import { urlParser } from "./urlParser";
import { ImportApiFunction } from "../utils/apiFunction.utils";

const errorHandler = new ApiErrorHandler();

export async function constructApi(
  url: URL,
  payload?: any,
  header?: Headers,
  method?: HttpMethods
) {
  try {
    if (method) {
      const apiFunction = await ImportApiFunction(method.toLowerCase());
      return apiFunction.default(url, { ...payload, ...header });
    }
    throw errorHandler.handle("Please provide the HTTP Method");
  } catch (e) {
    throw errorHandler.handle("Error occurred in construct API method:: " + e);
  }
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
    urlParser.parse(url.endpoint, url.baseUrl, url.queryParams),
    payload,
    headers,
    method
  );
}
