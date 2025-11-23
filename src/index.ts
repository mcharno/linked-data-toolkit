/**
 * Linked Data Toolkit - Main library exports
 * Version 2.0.0 - Modern TypeScript implementation
 *
 * A toolkit for SPARQL lookups against various authorities and linked data sources
 * including DBPedia, Geonames, Library of Congress, Ordnance Survey, and specialized
 * archaeological/heritage data sources.
 */

// General Clients
export { DBPediaClient } from './clients/dbpedia-client.js';
export { GeonamesClient } from './clients/geonames-client.js';
export { LoCSubjectClient } from './clients/loc-client.js';
export { OSClient } from './clients/os-client.js';
export { BaseSparqlClient } from './clients/base-sparql-client.js';

// Archaeological & Heritage Clients
export { NomismaClient } from './clients/nomisma-client.js';
export type { CoinType } from './clients/nomisma-client.js';
export { HeritageDataClient, HeritageVocabulary } from './clients/heritage-data-client.js';
export { GettyAATClient, AATFacet } from './clients/getty-aat-client.js';
export { ADSClient } from './clients/ads-client.js';
export type { ADSArchive } from './clients/ads-client.js';
export { NFDI4ObjectsClient } from './clients/nfdi4objects-client.js';

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
export { PeriodOHelper } from './utils/periodo-helper.js';
export type { PeriodOPeriod } from './utils/periodo-helper.js';
