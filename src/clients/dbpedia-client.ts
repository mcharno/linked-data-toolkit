/**
 * DBPedia SPARQL client for querying the DBPedia knowledge base
 */

import { BaseSparqlClient } from './base-sparql-client.js';
import { URILabelBinding, ClientConfig } from '../types/index.js';
import { makeURLSafe, capitalize } from '../utils/string-utils.js';

/**
 * Client for querying DBPedia SPARQL endpoint
 */
export class DBPediaClient extends BaseSparqlClient {
  private static readonly URL = 'http://dbpedia.org/sparql?query=';
  private static readonly SPARQL_ORG_1 =
    'PREFIX%20dbpedia-owl%3A%20%3Chttp%3A//dbpedia.org/ontology/%3E%20PREFIX%20dbpprop%3A%20%3Chttp%3A//dbpedia.org/property/%3E%20SELECT%20%3Flabel%20%3Furi%20WHERE%20%7B%3Furi%20rdfs%3Alabel%20%3Flabel%20;%20rdf%3Atype%20dbpedia-owl%3AOrganisation%20.%20FILTER%20(regex(%3Flabel,%20%22';
  private static readonly SPARQL_ORG_2 =
    '%22@en)%20&&%20langMatches(%20lang(%3Flabel),%20%22en%22))%7D%20LIMIT%20';
  private static readonly SPARQL_THING_1 =
    'PREFIX%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%20SELECT%20%3Furi%20WHERE%20%7B%20%3Furi%20rdfs%3Alabel%20%22';
  private static readonly SPARQL_THING_2 =
    '%22%40en%20FILTER%20(%20!strstarts(str(%3Furi)%2C%20%22http%3A%2F%2Fdbpedia.org%2Fresource%2FCategory%3A%22)%20)%20%7D%20LIMIT%201';
  private static readonly SPARQL_OUTPUT = '&format=json';

  constructor(config: ClientConfig = {}) {
    super(config);
  }

  /**
   * Looks up organizations in DBPedia
   * @param organization - The organization name to search for
   * @param maxResults - Maximum number of results to return (default: 10, max: 100)
   * @returns Array of URI/label bindings
   */
  async lookupOrganization(
    organization: string,
    maxResults: number = 10
  ): Promise<URILabelBinding[]> {
    const validatedResults = this.validateResultsCount(maxResults);

    const url =
      DBPediaClient.URL +
      DBPediaClient.SPARQL_ORG_1 +
      makeURLSafe(organization) +
      DBPediaClient.SPARQL_ORG_2 +
      validatedResults +
      DBPediaClient.SPARQL_OUTPUT;

    const json = await this.getResultsFromEndpoint(url);
    return this.parseStandardJSON(json);
  }

  /**
   * Looks up a single thing in DBPedia by exact label match
   * @param material - The thing to search for
   * @returns The URI of the first matching result, or null if not found
   */
  async lookupSingleThing(material: string): Promise<string | null> {
    const url =
      DBPediaClient.URL +
      DBPediaClient.SPARQL_THING_1 +
      makeURLSafe(capitalize(material)) +
      DBPediaClient.SPARQL_THING_2 +
      DBPediaClient.SPARQL_OUTPUT;

    const json = await this.getResultsFromEndpoint(url);
    const results = this.parseStandardJSON(json);

    return results.length > 0 ? results[0].uri : null;
  }
}
