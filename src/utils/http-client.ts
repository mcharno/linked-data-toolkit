/**
 * HTTP client utilities for making requests to SPARQL endpoints and REST APIs
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { LinkedDataError } from '../types/index.js';

/**
 * Configuration for the HTTP client
 */
export interface HttpClientConfig {
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * HTTP client wrapper with retry logic and error handling
 */
export class HttpClient {
  private client: AxiosInstance;
  private maxRetries: number;
  private retryDelay: number;

  constructor(config: HttpClientConfig = {}) {
    this.maxRetries = config.maxRetries ?? 3;
    this.retryDelay = config.retryDelay ?? 1000;

    this.client = axios.create({
      timeout: config.timeout ?? 30000,
      headers: {
        'User-Agent': 'linked-data-toolkit/2.0.0',
      },
    });
  }

  /**
   * Makes a GET request with retry logic
   */
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.client.get<T>(url, config);
        return response.data;
      } catch (error) {
        lastError = this.handleError(error);

        if (attempt < this.maxRetries && this.isRetryable(error)) {
          await this.delay(this.retryDelay * Math.pow(2, attempt));
          continue;
        }

        throw lastError;
      }
    }

    throw lastError ?? new LinkedDataError('Request failed after retries');
  }

  /**
   * Handles axios errors and converts them to LinkedDataError
   */
  private handleError(error: unknown): LinkedDataError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const message = axiosError.response?.data
        ? String(axiosError.response.data)
        : axiosError.message;

      return new LinkedDataError(
        `HTTP request failed: ${message}`,
        axiosError.code,
        axiosError.response?.status
      );
    }

    if (error instanceof Error) {
      return new LinkedDataError(`Request failed: ${error.message}`);
    }

    return new LinkedDataError('Unknown error occurred during request');
  }

  /**
   * Determines if an error is retryable
   */
  private isRetryable(error: unknown): boolean {
    if (!axios.isAxiosError(error)) {
      return false;
    }

    const axiosError = error as AxiosError;

    // Retry on network errors
    if (!axiosError.response) {
      return true;
    }

    // Retry on server errors (5xx) and rate limiting (429)
    const status = axiosError.response.status;
    return status >= 500 || status === 429;
  }

  /**
   * Delays execution for a specified duration
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
