export function ImportApiFunction(functionName: string) {
  const importer: Record<string, () => Promise<any>> = {
    get: () => import("../core/httpMethods/get/index"),
    post: () => import("../core/httpMethods/post/index"),
    put: () => import("../core/httpMethods/put/index"),
    delete: () => import("../core/httpMethods/delete/index"),
    patch: () => import("../core/httpMethods/patch/index"),
  };

  return importer[functionName]();
}
