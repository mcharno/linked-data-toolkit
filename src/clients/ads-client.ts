/**
 * Archaeology Data Service (ADS) client
 *
 * The ADS is the UK's digital repository for archaeological research,
 * providing access to grey literature, datasets, and metadata as linked open data.
 */

import { BaseSparqlClient } from './base-sparql-client.js';
import { URILabelBinding, ClientConfig } from '../types/index.js';

/**
 * ADS archive types
 */
export interface ADSArchive {
  uri: string;
  title?: string;
  description?: string;
  period?: string;
  subject?: string;
  coverage?: string;
}

/**
 * Client for querying Archaeology Data Service linked open data
 *
 * @example
 * ```typescript
 * const client = new ADSClient();
 * const archives = await client.searchArchives('Roman villa');
 * const periods = await client.searchByPeriod('Roman');
 * ```
 */
export class ADSClient extends BaseSparqlClient {
  private static readonly SPARQL_ENDPOINT =
    'https://data.archaeologydataservice.ac.uk/sparql/repositories/archives';

  constructor(config: ClientConfig = {}) {
    super(config);
  }

  /**
   * Searches ADS archives by keyword
   *
   * @param keyword - Search term
   * @param limit - Maximum number of results
   * @returns Array of matching archives
   */
  async searchArchives(keyword: string, limit: number = 20): Promise<URILabelBinding[]> {
    const query = `
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?uri ?label WHERE {
        ?uri dcterms:title ?label .
        FILTER(CONTAINS(LCASE(STR(?label)), LCASE("${this.escapeSparql(keyword)}")))
      }
      LIMIT ${this.validateResultsCount(limit, 0, 100)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Searches archives by period
   *
   * @param period - Period name (e.g., "Roman", "Medieval", "Bronze Age")
   * @param limit - Maximum number of results
   * @returns Array of archives from that period
   */
  async searchByPeriod(period: string, limit: number = 20): Promise<URILabelBinding[]> {
    const query = `
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

      SELECT DISTINCT ?uri ?label WHERE {
        ?uri dcterms:temporal ?temporal ;
             dcterms:title ?label .
        ?temporal skos:prefLabel ?periodLabel .
        FILTER(CONTAINS(LCASE(STR(?periodLabel)), LCASE("${this.escapeSparql(period)}")))
      }
      LIMIT ${this.validateResultsCount(limit, 0, 100)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Searches archives by subject/monument type
   *
   * @param subject - Subject term (e.g., "settlement", "burial", "villa")
   * @param limit - Maximum number of results
   * @returns Array of archives with that subject
   */
  async searchBySubject(subject: string, limit: number = 20): Promise<URILabelBinding[]> {
    const query = `
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

      SELECT DISTINCT ?uri ?label WHERE {
        ?uri dcterms:subject ?subjectUri ;
             dcterms:title ?label .
        ?subjectUri skos:prefLabel ?subjectLabel .
        FILTER(CONTAINS(LCASE(STR(?subjectLabel)), LCASE("${this.escapeSparql(subject)}")))
      }
      LIMIT ${this.validateResultsCount(limit, 0, 100)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Searches archives by geographic coverage
   *
   * @param location - Location name
   * @param limit - Maximum number of results
   * @returns Array of archives covering that location
   */
  async searchByLocation(location: string, limit: number = 20): Promise<URILabelBinding[]> {
    const query = `
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

      SELECT DISTINCT ?uri ?label WHERE {
        ?uri dcterms:spatial ?spatial ;
             dcterms:title ?label .
        FILTER(CONTAINS(LCASE(STR(?spatial)), LCASE("${this.escapeSparql(location)}")))
      }
      LIMIT ${this.validateResultsCount(limit, 0, 100)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Gets archives by contributor/organization
   *
   * @param contributor - Contributor name
   * @param limit - Maximum number of results
   * @returns Array of archives from that contributor
   */
  async searchByContributor(contributor: string, limit: number = 20): Promise<URILabelBinding[]> {
    const query = `
      PREFIX dcterms: <http://purl.org/dc/terms/>

      SELECT DISTINCT ?uri ?label WHERE {
        ?uri dcterms:contributor ?contrib ;
             dcterms:title ?label .
        FILTER(CONTAINS(LCASE(STR(?contrib)), LCASE("${this.escapeSparql(contributor)}")))
      }
      LIMIT ${this.validateResultsCount(limit, 0, 100)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Executes a SPARQL query against the ADS endpoint
   *
   * @param query - SPARQL query string
   * @returns Parsed results
   */
  private async executeSparqlQuery(query: string): Promise<URILabelBinding[]> {
    const encodedQuery = encodeURIComponent(query);
    const url = `${ADSClient.SPARQL_ENDPOINT}?query=${encodedQuery}&format=json`;

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
