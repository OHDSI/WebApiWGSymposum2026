import type { ApiClientConfig, ApiResponse } from './types/index.js';
import { ApiError } from './types/index.js';

/**
 * HTTP client for the Atlas WebAPI v3.
 *
 * Wraps the Fetch API with typed responses, configurable timeout,
 * default headers, and unified error handling via {@link ApiError}.
 */
export class AtlasApiClient {
  private readonly config: Required<Pick<ApiClientConfig, 'baseUrl' | 'timeout'>> &
    Pick<ApiClientConfig, 'headers'>;

  constructor(config: ApiClientConfig) {
    this.config = {
      baseUrl: config.baseUrl.replace(/\/+$/, ''), // strip trailing slashes
      headers: config.headers ?? {},
      timeout: config.timeout ?? 30_000,
    };
  }

  /** Returns a shallow copy of the current client configuration. */
  getConfig(): ApiClientConfig {
    return { ...this.config, headers: { ...this.config.headers } };
  }

  // -----------------------------------------------------------------------
  // Public HTTP helpers
  // -----------------------------------------------------------------------

  async get<T>(path: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, undefined, headers);
  }

  async post<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, body, headers);
  }

  async put<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, body, headers);
  }

  async delete<T>(path: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path, undefined, headers);
  }

  // -----------------------------------------------------------------------
  // Internal
  // -----------------------------------------------------------------------

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    extraHeaders?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

    const mergedHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config.headers,
      ...extraHeaders,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: mergedHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorBody: unknown;
        try {
          errorBody = await response.json();
        } catch {
          errorBody = await response.text().catch(() => undefined);
        }
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorBody,
        );
      }

      const data: T = await response.json();

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      return { data, status: response.status, headers: responseHeaders };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Request timed out', 408);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
