/**
 * Ordnance Survey client for UK geographic data
 */

import { BaseSparqlClient } from './base-sparql-client.js';
import { OSBinding, ClientConfig, SparqlResults } from '../types/index.js';
import { makeURLSafe } from '../utils/string-utils.js';

interface OSResult {
  id: { value: string };
  prefLabel: { value: string };
  type?: { value: string };
}

interface OSResponse extends SparqlResults {
  results: {
    bindings: OSResult[];
  };
}

/**
 * Client for querying Ordnance Survey linked data
 */
export class OSClient extends BaseSparqlClient {
  private static readonly URL =
    'http://api.talis.com/stores/ordnance-survey/services/sparql?query=';

  private static readonly SPARQL_PREFIX_PRECISE =
    'PREFIX+admingeo%3A+%3Chttp%3A%2F%2Fdata.ordnancesurvey.co.uk%2Fontology%2Fadmingeo%2F%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0ASELECT+%3FprefLabel+%3Fid%0D%0AWHERE+%7B%0D%0A++%3Fid+%3FaltLabel+%22';
  private static readonly SPARQL_SUFFIX_PRECISE =
    '%22+.%0D%0A++%3Fid+skos%3AprefLabel+%3FprefLabel+.%0D%0A++%3Fid+admingeo%3AgssCode+%3FgssCode+.%0D%0A%7D%0D%0ALIMIT+';

  private static readonly SPARQL_PREFIX_FUZZY =
    'PREFIX+admingeo%3A+<http%3A%2F%2Fdata.ordnancesurvey.co.uk%2Fontology%2Fadmingeo%2F>%0D%0APREFIX+skos%3A+<http%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23>%0D%0ASELECT+%3FprefLabel+%3Ftype+%3Fid%0D%0AWHERE+{%0D%0A++%3Fid+skos%3AprefLabel+%3FprefLabel+%3B%0D%0A++++++a+%3Ftype+%3B%0D%0A++++++admingeo%3AgssCode+%3FgssCode+.%0D%0A++FILTER+regex(%3FprefLabel%2C+%22';
  private static readonly SPARQL_SUFFIX_FUZZY = '%22)%0D%0A}%0D%0ALIMIT+';

  private static readonly SPARQL_OUTPUT = '&output=json';

  constructor(config: ClientConfig = {}) {
    super(config);
  }

  /**
   * Parses Ordnance Survey SPARQL JSON response
   */
  private parseOSJSON(json: string): Map<string, OSBinding> {
    const results = new Map<string, OSBinding>();

    try {
      const parsed: OSResponse = JSON.parse(json);

      if (!parsed.results?.bindings) {
        return results;
      }

      for (const binding of parsed.results.bindings) {
        const id = binding.id.value;
        const osBinding: OSBinding = {
          uri: id,
          label: binding.prefLabel.value,
          type: binding.type?.value,
        };

        results.set(id, osBinding);
      }
    } catch (error) {
      console.error('Failed to parse Ordnance Survey JSON:', error);
    }

    return results;
  }

  /**
   * Looks up a location with precise matching
   * @param location - The location name to search for
   * @param maxResults - Maximum number of results (default: 10, max: 100)
   */
  async lookupPreciseLocation(
    location: string,
    maxResults: number = 10
  ): Promise<Map<string, OSBinding>> {
    const validatedResults = this.validateResultsCount(maxResults);

    const url =
      OSClient.URL +
      OSClient.SPARQL_PREFIX_PRECISE +
      makeURLSafe(location) +
      OSClient.SPARQL_SUFFIX_PRECISE +
      validatedResults +
      OSClient.SPARQL_OUTPUT;

    const json = await this.getResultsFromEndpoint(url);
    return this.parseOSJSON(json);
  }

  /**
   * Looks up a location with fuzzy matching
   * @param location - The location name to search for
   * @param maxResults - Maximum number of results (default: 10, max: 100)
   */
  async lookupFuzzyLocation(
    location: string,
    maxResults: number = 10
  ): Promise<Map<string, OSBinding>> {
    const validatedResults = this.validateResultsCount(maxResults);

    const url =
      OSClient.URL +
      OSClient.SPARQL_PREFIX_FUZZY +
      makeURLSafe(location) +
      OSClient.SPARQL_SUFFIX_FUZZY +
      validatedResults +
      OSClient.SPARQL_OUTPUT;

    const json = await this.getResultsFromEndpoint(url);
    return this.parseOSJSON(json);
  }
}
