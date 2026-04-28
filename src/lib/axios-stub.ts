/**
 * Axios stub for Turbopack/SSR bundling.
 * stellar-sdk's stellartoml module imports axios, but we only use
 * the Horizon HTTP client (which uses fetch internally in the browser).
 * This stub prevents "Module not found: Can't resolve 'axios'" in Turbopack SSR.
 */
const axiosStub: unknown = {
  get: () => Promise.reject(new Error("axios is not available in this environment")),
  post: () => Promise.reject(new Error("axios is not available in this environment")),
  create: () => axiosStub,
  defaults: {},
  interceptors: { request: { use: () => {} }, response: { use: () => {} } },
};

export default axiosStub;
export const axiosClient = axiosStub;
export const create = () => axiosStub;
