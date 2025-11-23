/**
 * Linked Data Toolkit - Main library exports
 * Version 2.0.0 - Modern TypeScript implementation
 *
 * A toolkit for SPARQL lookups against various authorities and linked data sources
 * including DBPedia, Geonames, Library of Congress, and Ordnance Survey.
 */

// Clients
export { DBPediaClient } from './clients/dbpedia-client.js';
export { GeonamesClient } from './clients/geonames-client.js';
export { LoCSubjectClient } from './clients/loc-client.js';
export { OSClient } from './clients/os-client.js';
export { BaseSparqlClient } from './clients/base-sparql-client.js';

// Types
export type {
  URILabelBinding,
  GeonamesBinding,
  OSBinding,
  ClientConfig,
  GeonamesConfig,
  SparqlResults,
  SparqlBinding,
} from './types/index.js';

export { LinkedDataError } from './types/index.js';

// Utilities
export { makeURLSafe, capitalize, isValidUri } from './utils/string-utils.js';
export { HttpClient } from './utils/http-client.js';
export type { HttpClientConfig } from './utils/http-client.js';
