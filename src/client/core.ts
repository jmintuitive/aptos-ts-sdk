// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import { AptosConfig } from "../api/aptosConfig";
import { AptosApiError, AptosResponse } from "./types";
import { VERSION } from "../version";
import { AnyNumber, AptosRequest, Client, ClientRequest, ClientResponse, MimeType } from "../types";
import { AptosApiType } from "../utils";

/**
 * @category Error Handling
 * A mapping of HTTP status codes to their corresponding error messages.
 */
const errors: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
};

/**
 * Sends an HTTP request using the provided client and returns the response.
 *
 * @category Request Handling
 * @template Req - The request type.
 * @template Res - The response type.
 * @param options - The request options.
 * @param client - The client to use for sending the request.
 * @returns A promise resolving to the client response.
 *
 * @example
 * ```typescript
 * const response = await request<MyRequestType, MyResponseType>({
 *   url: 'https://api.aptos.dev/v1',
 *   method: 'GET',
 *   params: { param1: 'value1' },
 * }, client);
 * ```
 */
export async function request<Req, Res>(options: ClientRequest<Req>, client: Client): Promise<ClientResponse<Res>> {
  const { url, method, body, contentType, params, overrides, originMethod } = options;
  const headers: Record<string, string | AnyNumber | boolean | undefined> = {
    ...overrides?.HEADERS,
    "x-aptos-client": `aptos-typescript-sdk/${VERSION}`,
    "content-type": contentType ?? MimeType.JSON,
    "x-aptos-typescript-sdk-origin-method": originMethod,
  };

  if (overrides?.AUTH_TOKEN) {
    headers.Authorization = `Bearer ${overrides?.AUTH_TOKEN}`;
  }
  if (overrides?.API_KEY) {
    headers.Authorization = `Bearer ${overrides?.API_KEY}`;
  }

  /*
   * Make a call using the @aptos-labs/aptos-client package
   * {@link https://www.npmjs.com/package/@aptos-labs/aptos-client}
   */
  return client.provider<Req, Res>({
    url,
    method,
    body,
    params,
    headers,
    overrides,
  });
}

/**
 * The main function to use when making an API request.
 *
 * @category API Request
 * @template Req - The request type.
 * @template Res - The response type.
 * @param options - The request options.
 * @param aptosConfig - The configuration information for the SDK client instance.
 * @param apiType - The type of Aptos API being used.
 * @returns A promise resolving to the API response or an AptosApiError.
 *
 * @example
 * ```typescript
 * const response = await aptosRequest<MyRequestType, MyResponseType>({
 *   url: 'https://api.aptos.dev/v1',
 *   path: 'endpoint',
 *   method: 'GET',
 * }, aptosConfig, AptosApiType.INDEXER);
 * ```
 */
export async function aptosRequest<Req extends {}, Res extends {}>(
  options: AptosRequest,
  aptosConfig: AptosConfig,
  apiType: AptosApiType,
): Promise<AptosResponse<Req, Res>> {
  const { url, path } = options;
  const fullUrl = path ? `${url}/${path}` : url;
  const response = await request<Req, Res>({ ...options, url: fullUrl }, aptosConfig.client);

  const result: AptosResponse<Req, Res> = {
    status: response.status,
    statusText: response.statusText!,
    data: response.data,
    headers: response.headers,
    config: response.config,
    request: response.request,
    url: fullUrl,
  };

  // Handle case for `Unauthorized` error (i.e., API_KEY error)
  if (result.status === 401) {
    throw new AptosApiError(options, result, `Error: ${result.data}`);
  }

  // To support both fullnode and indexer responses,
  // check if it is an indexer query, and adjust response.data
  if (apiType === AptosApiType.INDEXER) {
    const indexerResponse = result.data as any;
    // Handle Indexer general errors
    if (indexerResponse.errors) {
      throw new AptosApiError(
        options,
        result,
        `Indexer error: ${indexerResponse.errors[0].message}` ??
          `Indexer unhandled Error ${response.status} : ${response.statusText}`,
      );
    }
    result.data = indexerResponse.data as Res;
  } else if (apiType === AptosApiType.PEPPER || apiType === AptosApiType.PROVER) {
    if (result.status >= 400) {
      throw new AptosApiError(options, result, `${response.data}`);
    }
  }

  if (result.status >= 200 && result.status < 300) {
    return result;
  }

  let errorMessage: string;

  if (result && result.data && "message" in result.data && "error_code" in result.data) {
    errorMessage = JSON.stringify(result.data);
  } else if (result.status in errors) {
    // If it's not an API type, it must come from infra, these are pre-handled
    errorMessage = errors[result.status];
  } else {
    // Everything else is unhandled
    errorMessage = `Unhandled Error ${result.status} : ${result.statusText}`;
  }

  // We have to explicitly check for all request types, because if the error is a non-indexer error, but
  // comes from an indexer request (e.g., 404), we'll need to mention it appropriately
  throw new AptosApiError(options, result, `${apiType} error: ${errorMessage}`);
}
