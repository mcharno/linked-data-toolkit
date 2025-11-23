/**
 * Base SPARQL client with common functionality
 */

import { HttpClient } from '../utils/http-client.js';
import { URILabelBinding, SparqlResults, ClientConfig } from '../types/index.js';

/**
 * Abstract base class for SPARQL clients
 */
export abstract class BaseSparqlClient {
  protected httpClient: HttpClient;

  constructor(config: ClientConfig = {}) {
    this.httpClient = new HttpClient(config);
  }

  /**
   * Fetches results from a SPARQL endpoint
   */
  protected async getResultsFromEndpoint(url: string): Promise<string> {
    return this.httpClient.get<string>(url);
  }

  /**
   * Parses JSON results where the root is an array of {uri, label} objects
   */
  protected parseRootArrayJSON(json: string): URILabelBinding[] {
    const results: URILabelBinding[] = [];

    try {
      const parsed = JSON.parse(json);

      if (!Array.isArray(parsed)) {
        return results;
      }

      for (const item of parsed) {
        if (typeof item === 'object' && item !== null) {
          const uri = item.uri ?? null;
          const label = item.label ?? null;

          if (uri !== null && label !== null) {
            results.push({ uri, label });
          }
        }
      }
    } catch (error) {
      console.error('Failed to parse root array JSON:', error);
    }

    return results;
  }

  /**
   * Parses standard SPARQL JSON results format
   */
  protected parseStandardJSON(json: string): URILabelBinding[] {
    const results: URILabelBinding[] = [];

    try {
      const parsed: SparqlResults = JSON.parse(json);

      if (!parsed.results?.bindings) {
        return results;
      }

      for (const binding of parsed.results.bindings) {
        const uri = binding.uri?.value ?? null;
        const label = binding.label?.value ?? null;

        results.push({ uri, label });
      }
    } catch (error) {
      console.error('Failed to parse standard SPARQL JSON:', error);
    }

    return results;
  }

  /**
   * Validates that results count is within acceptable range
   */
  protected validateResultsCount(count: number, min = 0, max = 100): number {
    if (count < min || count > max) {
      return Math.min(Math.max(count, min), max);
    }
    return count;
  }
}
