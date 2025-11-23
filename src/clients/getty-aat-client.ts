/**
 * Getty Art & Architecture Thesaurus (AAT) client
 *
 * The Getty AAT is a structured vocabulary for describing visual and material culture,
 * widely used in archaeology, art history, and museum documentation.
 */

import { BaseSparqlClient } from './base-sparql-client.js';
import { URILabelBinding, ClientConfig } from '../types/index.js';

/**
 * AAT facet categories
 */
export enum AATFacet {
  OBJECTS = 'aat:300264092', // Physical Objects
  MATERIALS = 'aat:300264091', // Materials
  ACTIVITIES = 'aat:300264090', // Activities
  AGENTS = 'aat:300264089', // Agents (People/Organizations)
  STYLES_PERIODS = 'aat:300264088', // Styles and Periods
  ASSOCIATED_CONCEPTS = 'aat:300264086', // Associated Concepts
}

/**
 * Client for querying Getty Art & Architecture Thesaurus
 *
 * @example
 * ```typescript
 * const client = new GettyAATClient();
 * const materials = await client.searchTerms('bronze', AATFacet.MATERIALS);
 * const periods = await client.searchTerms('Roman', AATFacet.STYLES_PERIODS);
 * ```
 */
export class GettyAATClient extends BaseSparqlClient {
  private static readonly SPARQL_ENDPOINT = 'https://vocab.getty.edu/sparql';

  constructor(config: ClientConfig = {}) {
    super(config);
  }

  /**
   * Searches AAT terms by keyword
   *
   * @param keyword - Search term
   * @param facet - Optional facet to restrict search
   * @param limit - Maximum number of results
   * @returns Array of matching concepts
   */
  async searchTerms(
    keyword: string,
    facet?: AATFacet,
    limit: number = 20
  ): Promise<URILabelBinding[]> {
    const facetFilter = facet
      ? `?uri gvp:broaderExtended ${facet} .`
      : '';

    const query = `
      PREFIX gvp: <http://vocab.getty.edu/ontology#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX luc: <http://www.ontotext.com/owlim/lucene#>

      SELECT ?uri ?label WHERE {
        ?uri a gvp:Subject ;
             luc:term "${this.escapeSparql(keyword)}" ;
             skos:prefLabel ?label .
        ${facetFilter}
        FILTER(lang(?label) = "en")
      }
      LIMIT ${this.validateResultsCount(limit, 0, 100)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Searches for materials
   *
   * @param material - Material name (e.g., "gold", "ceramic", "stone")
   * @param limit - Maximum number of results
   * @returns Array of material concepts
   */
  async searchMaterials(material: string, limit: number = 20): Promise<URILabelBinding[]> {
    return this.searchTerms(material, AATFacet.MATERIALS, limit);
  }

  /**
   * Searches for object types
   *
   * @param objectType - Object type (e.g., "vessel", "tool", "building")
   * @param limit - Maximum number of results
   * @returns Array of object type concepts
   */
  async searchObjectTypes(objectType: string, limit: number = 20): Promise<URILabelBinding[]> {
    return this.searchTerms(objectType, AATFacet.OBJECTS, limit);
  }

  /**
   * Searches for styles and periods
   *
   * @param period - Period or style name (e.g., "Roman", "Gothic", "Bronze Age")
   * @param limit - Maximum number of results
   * @returns Array of period/style concepts
   */
  async searchStylesAndPeriods(period: string, limit: number = 20): Promise<URILabelBinding[]> {
    return this.searchTerms(period, AATFacet.STYLES_PERIODS, limit);
  }

  /**
   * Searches for activities
   *
   * @param activity - Activity name (e.g., "excavation", "conservation")
   * @param limit - Maximum number of results
   * @returns Array of activity concepts
   */
  async searchActivities(activity: string, limit: number = 20): Promise<URILabelBinding[]> {
    return this.searchTerms(activity, AATFacet.ACTIVITIES, limit);
  }

  /**
   * Gets broader terms for a given AAT concept
   *
   * @param uri - AAT concept URI
   * @returns Array of broader concepts
   */
  async getBroaderTerms(uri: string): Promise<URILabelBinding[]> {
    const query = `
      PREFIX gvp: <http://vocab.getty.edu/ontology#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

      SELECT ?uri ?label WHERE {
        <${uri}> gvp:broader ?uri .
        ?uri skos:prefLabel ?label .
        FILTER(lang(?label) = "en")
      }
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Gets narrower terms for a given AAT concept
   *
   * @param uri - AAT concept URI
   * @param limit - Maximum number of results
   * @returns Array of narrower concepts
   */
  async getNarrowerTerms(uri: string, limit: number = 50): Promise<URILabelBinding[]> {
    const query = `
      PREFIX gvp: <http://vocab.getty.edu/ontology#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

      SELECT ?uri ?label WHERE {
        <${uri}> gvp:narrower ?uri .
        ?uri skos:prefLabel ?label .
        FILTER(lang(?label) = "en")
      }
      LIMIT ${this.validateResultsCount(limit, 0, 200)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Gets related terms for a given AAT concept
   *
   * @param uri - AAT concept URI
   * @param limit - Maximum number of results
   * @returns Array of related concepts
   */
  async getRelatedTerms(uri: string, limit: number = 50): Promise<URILabelBinding[]> {
    const query = `
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

      SELECT ?uri ?label WHERE {
        <${uri}> skos:related ?uri .
        ?uri skos:prefLabel ?label .
        FILTER(lang(?label) = "en")
      }
      LIMIT ${this.validateResultsCount(limit, 0, 200)}
    `;

    return this.executeSparqlQuery(query);
  }

  /**
   * Executes a SPARQL query against the Getty AAT endpoint
   *
   * @param query - SPARQL query string
   * @returns Parsed results
   */
  private async executeSparqlQuery(query: string): Promise<URILabelBinding[]> {
    const encodedQuery = encodeURIComponent(query);
    const url = `${GettyAATClient.SPARQL_ENDPOINT}?query=${encodedQuery}&format=json`;

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
