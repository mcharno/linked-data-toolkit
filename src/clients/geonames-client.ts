/**
 * Geonames API client for geographic name lookups
 */

import { BaseSparqlClient } from './base-sparql-client.js';
import { GeonamesBinding, GeonamesConfig } from '../types/index.js';
import { makeURLSafe } from '../utils/string-utils.js';
import { LinkedDataError } from '../types/index.js';

interface GeonamesResult {
  geonameId: number;
  toponymName: string;
  countryCode: string;
  fcl: string;
  fcode: string;
}

interface GeonamesResponse {
  geonames: GeonamesResult[];
}

/**
 * Client for querying Geonames API
 */
export class GeonamesClient extends BaseSparqlClient {
  private static readonly URL_PRECISE = 'http://api.geonames.org/search?name_equals=';
  private static readonly URL_FUZZY = 'http://api.geonames.org/search?name=';
  private static readonly VAR_ROWS = '&maxRows=';
  private static readonly VAR_COUNTRY = '&country=';
  private static readonly VAR_FAVOR_UK = '&countryBias=GB';
  private static readonly VAR_CONTINENT = '&continentCode=';
  private static readonly VAR_SUFFIX =
    '&featureClass=A&featureClass=P&style=SHORT&type=json&username=';
  private static readonly URI_PREFIX = 'http://sws.geonames.org/';

  private username: string;

  constructor(config: GeonamesConfig) {
    super(config);

    if (!config.username) {
      throw new LinkedDataError('Geonames username is required');
    }

    this.username = config.username;
  }

  /**
   * Parses Geonames JSON response
   */
  private parseGeonamesJSON(json: string): Map<string, GeonamesBinding> {
    const results = new Map<string, GeonamesBinding>();

    try {
      const parsed: GeonamesResponse = JSON.parse(json);

      if (!parsed.geonames || !Array.isArray(parsed.geonames)) {
        return results;
      }

      for (const item of parsed.geonames) {
        const binding: GeonamesBinding = {
          uri: `${GeonamesClient.URI_PREFIX}${item.geonameId}`,
          label: item.toponymName,
          toponymName: item.toponymName,
          geonameId: String(item.geonameId),
          countryCode: item.countryCode,
          functionClass: item.fcl,
          functionCode: item.fcode,
        };

        results.set(binding.uri!, binding);
      }
    } catch (error) {
      console.error('Failed to parse Geonames JSON:', error);
    }

    return results;
  }

  /**
   * Looks up a precise location within a specific country
   */
  async lookupPreciseLocationInCountry(
    location: string,
    country: string,
    maxResults: number = 10
  ): Promise<Map<string, GeonamesBinding>> {
    const validatedResults = this.validateResultsCount(maxResults);

    const url =
      GeonamesClient.URL_PRECISE +
      makeURLSafe(location) +
      GeonamesClient.VAR_COUNTRY +
      country +
      GeonamesClient.VAR_ROWS +
      validatedResults +
      GeonamesClient.VAR_SUFFIX +
      this.username;

    const json = await this.getResultsFromEndpoint(url);
    return this.parseGeonamesJSON(json);
  }

  /**
   * Looks up a precise location within a specific continent
   */
  async lookupPreciseLocationInContinent(
    location: string,
    continent: string,
    maxResults: number = 10
  ): Promise<Map<string, GeonamesBinding>> {
    const validatedResults = this.validateResultsCount(maxResults);

    const url =
      GeonamesClient.URL_PRECISE +
      makeURLSafe(location) +
      GeonamesClient.VAR_CONTINENT +
      continent +
      GeonamesClient.VAR_ROWS +
      validatedResults +
      GeonamesClient.VAR_SUFFIX +
      this.username;

    const json = await this.getResultsFromEndpoint(url);
    return this.parseGeonamesJSON(json);
  }

  /**
   * Looks up a precise location anywhere in the world
   */
  async lookupPreciseLocationInWorld(
    location: string,
    maxResults: number = 10
  ): Promise<Map<string, GeonamesBinding>> {
    const validatedResults = this.validateResultsCount(maxResults);

    const url =
      GeonamesClient.URL_PRECISE +
      makeURLSafe(location) +
      GeonamesClient.VAR_ROWS +
      validatedResults +
      GeonamesClient.VAR_SUFFIX +
      this.username;

    const json = await this.getResultsFromEndpoint(url);
    return this.parseGeonamesJSON(json);
  }

  /**
   * Looks up a location with UK bias
   */
  async lookupLocationFavorUK(
    location: string,
    maxResults: number = 10
  ): Promise<Map<string, GeonamesBinding>> {
    const validatedResults = this.validateResultsCount(maxResults);

    const url =
      GeonamesClient.URL_PRECISE +
      makeURLSafe(location) +
      GeonamesClient.VAR_FAVOR_UK +
      GeonamesClient.VAR_ROWS +
      validatedResults +
      GeonamesClient.VAR_SUFFIX +
      this.username;

    const json = await this.getResultsFromEndpoint(url);
    return this.parseGeonamesJSON(json);
  }

  /**
   * Performs fuzzy location lookup within a specific country
   */
  async lookupFuzzyLocationInCountry(
    location: string,
    country: string,
    maxResults: number = 10
  ): Promise<Map<string, GeonamesBinding>> {
    const validatedResults = this.validateResultsCount(maxResults);

    const url =
      GeonamesClient.URL_FUZZY +
      makeURLSafe(location) +
      GeonamesClient.VAR_COUNTRY +
      country +
      GeonamesClient.VAR_ROWS +
      validatedResults +
      GeonamesClient.VAR_SUFFIX +
      this.username;

    const json = await this.getResultsFromEndpoint(url);
    return this.parseGeonamesJSON(json);
  }

  /**
   * Performs fuzzy location lookup within a specific continent
   */
  async lookupFuzzyLocationInContinent(
    location: string,
    continent: string,
    maxResults: number = 10
  ): Promise<Map<string, GeonamesBinding>> {
    const validatedResults = this.validateResultsCount(maxResults);

    const url =
      GeonamesClient.URL_FUZZY +
      makeURLSafe(location) +
      GeonamesClient.VAR_CONTINENT +
      continent +
      GeonamesClient.VAR_ROWS +
      validatedResults +
      GeonamesClient.VAR_SUFFIX +
      this.username;

    const json = await this.getResultsFromEndpoint(url);
    return this.parseGeonamesJSON(json);
  }
}
