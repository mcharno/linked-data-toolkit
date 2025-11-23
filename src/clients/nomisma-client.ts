/**
 * Nomisma client for querying numismatic linked data
 *
 * Nomisma.org is a collaborative project providing stable digital representations
 * of numismatic concepts according to Linked Open Data principles.
 */

import { BaseSparqlClient } from './base-sparql-client.js';
import { URILabelBinding, ClientConfig } from '../types/index.js';

/**
 * Represents a numismatic coin type
 */
export interface CoinType {
  uri: string;
  label?: string;
  denomination?: string;
  material?: string;
  authority?: string;
  mint?: string;
  startDate?: number;
  endDate?: number;
}

/**
 * Client for querying Nomisma.org numismatic data
 *
 * @example
 * ```typescript
 * const client = new NomismaClient();
 * const concepts = await client.searchConcepts('denarius');
 * const mints = await client.findMints('Rome');
 * ```
 */
export class NomismaClient extends BaseSparqlClient {
  private static readonly SPARQL_ENDPOINT = 'http://nomisma.org/sparql';

  constructor(config: ClientConfig = {}) {
    super(config);
  }

  /**
   * Searches for numismatic concepts by keyword
   *
   * @param keyword - Search term (e.g., coin type, mint, denomination)
   * @param limit - Maximum number of results
   * @returns Array of matching concepts
   */
  async searchConcepts(keyword: string, limit: number = 20): Promise<URILabelBinding[]> {
    const query = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX nm: <http://nomisma.org/id/>

      SELECT ?uri ?label WHERE {
        ?uri skos:prefLabel ?label .
        FILTER(CONTAINS(LCASE(?label), LCASE("${this.escapeSparql(keyword)}")))
        FILTER(langMatches(lang(?label), "en"))
      }
      LIMIT ${this.validateResultsCount(limit, 0, 100)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Finds mints by location name
   *
   * @param location - Mint location name
   * @param limit - Maximum number of results
   * @returns Array of mint URIs and labels
   */
  async findMints(location: string, limit: number = 20): Promise<URILabelBinding[]> {
    const query = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX nm: <http://nomisma.org/id/>
      PREFIX nmo: <http://nomisma.org/ontology#>

      SELECT ?uri ?label WHERE {
        ?uri a nmo:Mint ;
             skos:prefLabel ?label .
        FILTER(CONTAINS(LCASE(?label), LCASE("${this.escapeSparql(location)}")))
        FILTER(langMatches(lang(?label), "en"))
      }
      LIMIT ${this.validateResultsCount(limit, 0, 100)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Finds denominations by name
   *
   * @param name - Denomination name (e.g., "denarius", "aureus")
   * @param limit - Maximum number of results
   * @returns Array of denomination URIs and labels
   */
  async findDenominations(name: string, limit: number = 20): Promise<URILabelBinding[]> {
    const query = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX nmo: <http://nomisma.org/ontology#>

      SELECT ?uri ?label WHERE {
        ?uri a nmo:Denomination ;
             skos:prefLabel ?label .
        FILTER(CONTAINS(LCASE(?label), LCASE("${this.escapeSparql(name)}")))
        FILTER(langMatches(lang(?label), "en"))
      }
      LIMIT ${this.validateResultsCount(limit, 0, 100)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Finds materials used in coinage
   *
   * @param material - Material name (e.g., "gold", "silver", "bronze")
   * @param limit - Maximum number of results
   * @returns Array of material URIs and labels
   */
  async findMaterials(material: string, limit: number = 20): Promise<URILabelBinding[]> {
    const query = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX nmo: <http://nomisma.org/ontology#>

      SELECT ?uri ?label WHERE {
        ?uri a nmo:Material ;
             skos:prefLabel ?label .
        FILTER(CONTAINS(LCASE(?label), LCASE("${this.escapeSparql(material)}")))
        FILTER(langMatches(lang(?label), "en"))
      }
      LIMIT ${this.validateResultsCount(limit, 0, 100)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Searches for authorities (rulers, states) who issued coins
   *
   * @param authority - Authority name
   * @param limit - Maximum number of results
   * @returns Array of authority URIs and labels
   */
  async findAuthorities(authority: string, limit: number = 20): Promise<URILabelBinding[]> {
    const query = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX nmo: <http://nomisma.org/ontology#>

      SELECT ?uri ?label WHERE {
        ?uri skos:prefLabel ?label .
        {?uri a nmo:Authority} UNION {?uri a <http://xmlns.com/foaf/0.1/Person>}
        FILTER(CONTAINS(LCASE(?label), LCASE("${this.escapeSparql(authority)}")))
        FILTER(langMatches(lang(?label), "en"))
      }
      LIMIT ${this.validateResultsCount(limit, 0, 100)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Executes a SPARQL query against the Nomisma endpoint
   *
   * @param query - SPARQL query string
   * @returns Parsed results
   */
  private async executeSparqlQuery(query: string): Promise<URILabelBinding[]> {
    const encodedQuery = encodeURIComponent(query);
    const url = `${NomismaClient.SPARQL_ENDPOINT}?query=${encodedQuery}&format=json`;

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
