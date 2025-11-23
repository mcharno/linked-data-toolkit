/**
 * NFDI4Objects client for querying the German archaeological knowledge graph
 *
 * NFDI4Objects provides access to research data about cultural heritage objects
 * through a knowledge graph with SPARQL and Cypher query interfaces.
 */

import { BaseSparqlClient } from './base-sparql-client.js';
import { URILabelBinding, ClientConfig } from '../types/index.js';

/**
 * Client for querying NFDI4Objects Knowledge Graph
 *
 * @example
 * ```typescript
 * const client = new NFDI4ObjectsClient();
 * const collections = await client.searchCollections('pottery');
 * const objects = await client.searchObjects('Roman coin');
 * ```
 */
export class NFDI4ObjectsClient extends BaseSparqlClient {
  private static readonly SPARQL_ENDPOINT = 'https://graph.nfdi4objects.net/api/sparql';
  private static readonly COLLECTION_BASE = 'https://graph.nfdi4objects.net/collection/';

  constructor(config: ClientConfig = {}) {
    super(config);
  }

  /**
   * Searches collections in the NFDI4Objects graph
   *
   * @param keyword - Search term
   * @param limit - Maximum number of results
   * @returns Array of matching collections
   */
  async searchCollections(keyword: string, limit: number = 20): Promise<URILabelBinding[]> {
    const query = `
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?uri ?label WHERE {
        ?uri a <http://www.w3.org/ns/dcat#Dataset> ;
             dcterms:title ?label .
        FILTER(CONTAINS(LCASE(STR(?label)), LCASE("${this.escapeSparql(keyword)}")))
      }
      LIMIT ${this.validateResultsCount(limit, 0, 100)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Searches for cultural heritage objects
   *
   * @param keyword - Search term (object type, material, etc.)
   * @param limit - Maximum number of results
   * @returns Array of matching objects
   */
  async searchObjects(keyword: string, limit: number = 20): Promise<URILabelBinding[]> {
    const query = `
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?uri ?label WHERE {
        ?uri a crm:E22_Man-Made_Object ;
             rdfs:label ?label .
        FILTER(CONTAINS(LCASE(STR(?label)), LCASE("${this.escapeSparql(keyword)}")))
      }
      LIMIT ${this.validateResultsCount(limit, 0, 100)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Searches using the Linked Archaeological Data Ontology (LADO)
   *
   * @param keyword - Search term
   * @param limit - Maximum number of results
   * @returns Array of archaeological entities
   */
  async searchArchaeologicalEntities(
    keyword: string,
    limit: number = 20
  ): Promise<URILabelBinding[]> {
    const query = `
      PREFIX lado: <https://archaeology.link/ontology#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?uri ?label WHERE {
        ?uri rdfs:label ?label .
        FILTER(CONTAINS(LCASE(STR(?label)), LCASE("${this.escapeSparql(keyword)}")))
      }
      LIMIT ${this.validateResultsCount(limit, 0, 100)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Gets objects by material
   *
   * @param material - Material name (e.g., "ceramic", "metal", "stone")
   * @param limit - Maximum number of results
   * @returns Array of objects made from that material
   */
  async searchByMaterial(material: string, limit: number = 20): Promise<URILabelBinding[]> {
    const query = `
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?uri ?label WHERE {
        ?uri a crm:E22_Man-Made_Object ;
             rdfs:label ?label ;
             crm:P45_consists_of ?material .
        ?material rdfs:label ?materialLabel .
        FILTER(CONTAINS(LCASE(STR(?materialLabel)), LCASE("${this.escapeSparql(material)}")))
      }
      LIMIT ${this.validateResultsCount(limit, 0, 100)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Searches for periods/chronological information
   *
   * @param period - Period name
   * @param limit - Maximum number of results
   * @returns Array of period-related entities
   */
  async searchByPeriod(period: string, limit: number = 20): Promise<URILabelBinding[]> {
    const query = `
      PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?uri ?label WHERE {
        ?uri rdfs:label ?label ;
             crm:P10_falls_within ?timespan .
        ?timespan rdfs:label ?periodLabel .
        FILTER(CONTAINS(LCASE(STR(?periodLabel)), LCASE("${this.escapeSparql(period)}")))
      }
      LIMIT ${this.validateResultsCount(limit, 0, 100)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Executes a SPARQL query against the NFDI4Objects endpoint
   *
   * @param query - SPARQL query string
   * @returns Parsed results
   */
  private async executeSparqlQuery(query: string): Promise<URILabelBinding[]> {
    const encodedQuery = encodeURIComponent(query);
    const url = `${NFDI4ObjectsClient.SPARQL_ENDPOINT}?query=${encodedQuery}&format=json`;

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
