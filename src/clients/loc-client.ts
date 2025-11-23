/**
 * Library of Congress Subject Headings client
 */

import { BaseSparqlClient } from './base-sparql-client.js';
import { URILabelBinding, ClientConfig, SparqlResults } from '../types/index.js';
import { makeURLSafe } from '../utils/string-utils.js';

/**
 * Client for querying Library of Congress Subject Headings
 * Note: The original Java implementation used a custom SPARQL endpoint at York University.
 * This implementation assumes you have access to a similar endpoint or you'll need to update the URL.
 */
export class LoCSubjectClient extends BaseSparqlClient {
  private readonly endpoint: string;

  private static readonly SPARQL_SUBJ_PRECISE_PREFIX =
    'PREFIX%20skos%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0Aselect%20%3Furi%20%3Flabel%20%7B%0A%20%20%3Furi%20skos%3AprefLabel%20%3Flabel%20.%0A%20%20%3Furi%20skos%3AprefLabel%20%22';
  private static readonly SPARQL_SUBJ_PRECISE_SUFFIX = '%22%40en%0A%7D';

  private static readonly SPARQL_SUBJ_STARTS_PREFIX =
    'PREFIX%20skos%3A%20%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0Aselect%20%3Furi%20%3Flabel%20%7B%0A%20%20%3Furi%20skos%3AprefLabel%20%3Flabel%20.%0A%20%20FILTER%20regex(str(%3Flabel)%2C%20%27%5E';
  private static readonly SPARQL_SUBJ_STARTS_SUFFIX = "%27%40en%2C%20%27i%27)%0A%7D%0ALIMIT%20300";

  private static readonly SPARQL_SUBJ_FUZZY_PREFIX =
    'PREFIX%20skos%3A%20%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0Aselect%20%3Furi%20%3Flabel%20%7B%0A%20%20%3Furi%20skos%3AprefLabel%20%3Flabel%20.%0A%20%20FILTER%20regex(str(%3Flabel)%2C%20%27';
  private static readonly SPARQL_SUBJ_FUZZY_SUFFIX = "%27%40en%2C%20%27i%27)%0A%7D%0ALIMIT%20500";

  constructor(endpoint?: string, config: ClientConfig = {}) {
    super(config);
    // Default endpoint - you may need to update this based on your access
    this.endpoint =
      endpoint ?? 'http://id.loc.gov/authorities/subjects/suggest2/?q={query}';
  }

  /**
   * Parses SPARQL XML or JSON results
   * The original implementation used XML, but modern endpoints often support JSON
   */
  private parseResults(data: string): URILabelBinding[] {
    try {
      // Try parsing as JSON first (standard SPARQL JSON results format)
      const parsed: SparqlResults = JSON.parse(data);
      return this.parseStandardJSON(data);
    } catch {
      // If JSON parsing fails, fall back to extracting from XML
      // Note: For production use, consider using a proper XML parser library
      return this.parseXMLResults(data);
    }
  }

  /**
   * Basic XML parsing for SPARQL results
   * Note: This is a simplified implementation. For production, use a proper XML parser.
   */
  private parseXMLResults(xml: string): URILabelBinding[] {
    const results: URILabelBinding[] = [];

    // Simple regex-based extraction (not robust for all XML)
    const bindingRegex = /<result>([\s\S]*?)<\/result>/g;
    const uriRegex = /<binding name="uri">[\s\S]*?<uri>(.*?)<\/uri>[\s\S]*?<\/binding>/;
    const labelRegex =
      /<binding name="label">[\s\S]*?<literal[^>]*>(.*?)<\/literal>[\s\S]*?<\/binding>/;

    let match;
    while ((match = bindingRegex.exec(xml)) !== null) {
      const bindingXml = match[1];
      const uriMatch = uriRegex.exec(bindingXml);
      const labelMatch = labelRegex.exec(bindingXml);

      if (uriMatch || labelMatch) {
        results.push({
          uri: uriMatch?.[1] ?? null,
          label: labelMatch?.[1] ?? null,
        });
      }
    }

    return results;
  }

  /**
   * Looks up a subject with exact match
   */
  async lookupSubjectExact(subject: string): Promise<URILabelBinding[]> {
    const url =
      this.endpoint +
      LoCSubjectClient.SPARQL_SUBJ_PRECISE_PREFIX +
      makeURLSafe(subject) +
      LoCSubjectClient.SPARQL_SUBJ_PRECISE_SUFFIX;

    const data = await this.getResultsFromEndpoint(url);
    return this.parseResults(data);
  }

  /**
   * Looks up subjects that start with the given term
   */
  async lookupSubjectStartsWith(subject: string): Promise<URILabelBinding[]> {
    const url =
      this.endpoint +
      LoCSubjectClient.SPARQL_SUBJ_STARTS_PREFIX +
      makeURLSafe(subject.toLowerCase()) +
      LoCSubjectClient.SPARQL_SUBJ_STARTS_SUFFIX;

    const data = await this.getResultsFromEndpoint(url);
    return this.parseResults(data);
  }

  /**
   * Performs fuzzy lookup of subjects
   */
  async lookupSubjectFuzzy(subject: string): Promise<URILabelBinding[]> {
    const url =
      this.endpoint +
      LoCSubjectClient.SPARQL_SUBJ_FUZZY_PREFIX +
      makeURLSafe(subject.toLowerCase()) +
      LoCSubjectClient.SPARQL_SUBJ_FUZZY_SUFFIX;

    const data = await this.getResultsFromEndpoint(url);
    return this.parseResults(data);
  }

  /**
   * Recursive lookup that handles hierarchical subject headings with "--" separators
   * If no exact match is found, tries progressively shorter versions
   */
  async lookupSubjectCMSValues(subject: string): Promise<URILabelBinding[]> {
    // Normalize the subject heading separators
    const normalizedSubject = subject
      .replace(/ -- /g, '--')
      .replace(/ --/g, '--')
      .replace(/-- /g, '--');

    const url =
      this.endpoint +
      LoCSubjectClient.SPARQL_SUBJ_PRECISE_PREFIX +
      makeURLSafe(normalizedSubject) +
      LoCSubjectClient.SPARQL_SUBJ_PRECISE_SUFFIX;

    const data = await this.getResultsFromEndpoint(url);
    let results = this.parseResults(data);

    // If no results and there's a hierarchy, try the parent subject
    if (results.length === 0 && normalizedSubject.includes('--')) {
      const lastDashIndex = normalizedSubject.lastIndexOf('--');
      const parentSubject = normalizedSubject.substring(0, lastDashIndex);
      results = await this.lookupSubjectCMSValues(parentSubject);
    }

    return results;
  }
}
