/**
 * Heritage Data UK client for querying heritage vocabularies
 *
 * Heritage Data provides SPARQL access to UK heritage vocabularies including
 * monument types, archaeological objects, maritime craft, and more.
 */

import { BaseSparqlClient } from './base-sparql-client.js';
import { URILabelBinding, ClientConfig } from '../types/index.js';

/**
 * Available Heritage Data vocabularies
 */
export enum HeritageVocabulary {
  MONUMENT_TYPES = 'eh_tmt2',
  MARITIME_CRAFT = 'eh_tmc',
  ARCHAEOLOGICAL_OBJECTS = 'mda_obj',
  ARCHAEOLOGICAL_SCIENCES = 'eh_asd',
  BUILDING_MATERIALS = 'eh_tbm',
  COMPONENTS = 'eh_com',
  EVIDENCE = 'eh_evd',
  PERIODS = 'eh_period',
  HISTORIC_CHARACTER = 'eh_hc',
}

/**
 * Client for querying Heritage Data UK SPARQL endpoint
 *
 * @example
 * ```typescript
 * const client = new HeritageDataClient();
 * const monuments = await client.searchVocabulary(
 *   HeritageVocabulary.MONUMENT_TYPES,
 *   'castle'
 * );
 * ```
 */
export class HeritageDataClient extends BaseSparqlClient {
  private static readonly SPARQL_ENDPOINT = 'http://heritagedata.org/live/sparql';

  constructor(config: ClientConfig = {}) {
    super(config);
  }

  /**
   * Searches a specific heritage vocabulary
   *
   * @param vocabulary - The vocabulary to search
   * @param keyword - Search term
   * @param limit - Maximum number of results
   * @returns Array of matching concepts
   */
  async searchVocabulary(
    vocabulary: HeritageVocabulary,
    keyword: string,
    limit: number = 20
  ): Promise<URILabelBinding[]> {
    const query = `
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX scheme: <http://heritagedata.org/live/schemes/>

      SELECT DISTINCT ?uri ?label WHERE {
        ?uri skos:inScheme scheme:${vocabulary} ;
             skos:prefLabel ?label .
        FILTER(CONTAINS(LCASE(STR(?label)), LCASE("${this.escapeSparql(keyword)}")))
        FILTER(langMatches(lang(?label), "en"))
      }
      LIMIT ${this.validateResultsCount(limit, 0, 100)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Searches monument types
   *
   * @param keyword - Search term (e.g., "castle", "church", "villa")
   * @param limit - Maximum number of results
   * @returns Array of monument type concepts
   */
  async searchMonumentTypes(keyword: string, limit: number = 20): Promise<URILabelBinding[]> {
    return this.searchVocabulary(HeritageVocabulary.MONUMENT_TYPES, keyword, limit);
  }

  /**
   * Searches archaeological object types
   *
   * @param keyword - Search term (e.g., "pottery", "coin", "tool")
   * @param limit - Maximum number of results
   * @returns Array of object type concepts
   */
  async searchObjectTypes(keyword: string, limit: number = 20): Promise<URILabelBinding[]> {
    return this.searchVocabulary(HeritageVocabulary.ARCHAEOLOGICAL_OBJECTS, keyword, limit);
  }

  /**
   * Searches period definitions
   *
   * @param keyword - Search term (e.g., "Roman", "Medieval", "Bronze Age")
   * @param limit - Maximum number of results
   * @returns Array of period concepts
   */
  async searchPeriods(keyword: string, limit: number = 20): Promise<URILabelBinding[]> {
    return this.searchVocabulary(HeritageVocabulary.PERIODS, keyword, limit);
  }

  /**
   * Searches building materials
   *
   * @param keyword - Search term (e.g., "stone", "brick", "timber")
   * @param limit - Maximum number of results
   * @returns Array of material concepts
   */
  async searchBuildingMaterials(keyword: string, limit: number = 20): Promise<URILabelBinding[]> {
    return this.searchVocabulary(HeritageVocabulary.BUILDING_MATERIALS, keyword, limit);
  }

  /**
   * Gets broader concepts for a given URI
   *
   * @param uri - Concept URI
   * @returns Array of broader concepts
   */
  async getBroaderConcepts(uri: string): Promise<URILabelBinding[]> {
    const query = `
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

      SELECT ?uri ?label WHERE {
        <${uri}> skos:broader ?uri .
        ?uri skos:prefLabel ?label .
        FILTER(langMatches(lang(?label), "en"))
      }
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Gets narrower concepts for a given URI
   *
   * @param uri - Concept URI
   * @param limit - Maximum number of results
   * @returns Array of narrower concepts
   */
  async getNarrowerConcepts(uri: string, limit: number = 50): Promise<URILabelBinding[]> {
    const query = `
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

      SELECT ?uri ?label WHERE {
        <${uri}> skos:narrower ?uri .
        ?uri skos:prefLabel ?label .
        FILTER(langMatches(lang(?label), "en"))
      }
      LIMIT ${this.validateResultsCount(limit, 0, 200)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Executes a SPARQL query against the Heritage Data endpoint
   *
   * @param query - SPARQL query string
   * @returns Parsed results
   */
  private async executeSparqlQuery(query: string): Promise<URILabelBinding[]> {
    const encodedQuery = encodeURIComponent(query);
    const url = `${HeritageDataClient.SPARQL_ENDPOINT}?query=${encodedQuery}&format=json`;

    const json = await this.getResultsFromEndpoint(url);
    return this.parseStandardJSON(json);
  }

  /**
   * Escapes special characters in SPARQL queries
   *
   * @param value - String to escape
   * @returns Escaped string
   */
  private escapeSparql(value: string): string {
    return value.replace(/["'\\]/g, '\\$&');
  }
}
