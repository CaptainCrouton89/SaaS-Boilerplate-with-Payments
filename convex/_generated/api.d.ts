/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as payments from "../payments.js";
import type * as products from "../products.js";
import type * as router from "../router.js";
import type * as sampleData from "../sampleData.js";
import type * as subscriptions from "../subscriptions.js";
import type * as utils_errors from "../utils/errors.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  http: typeof http;
  payments: typeof payments;
  products: typeof products;
  router: typeof router;
  sampleData: typeof sampleData;
  subscriptions: typeof subscriptions;
  "utils/errors": typeof utils_errors;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
