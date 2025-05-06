export function ImportApiFunction(functionName: string) {
  const importer: Record<string, () => Promise<any>> = {
    get: () => import("../core/HttpMethods/get/index"),
    post: () => import("../core/HttpMethods/post/index"),
    put: () => import("../core/HttpMethods/put/index"),
    delete: () => import("../core/HttpMethods/delete/index"),
    patch: () => import("../core/HttpMethods/patch/index"),
  };

  return importer[functionName]();
}
