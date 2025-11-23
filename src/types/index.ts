/**
 * Core types and interfaces for the Linked Data Toolkit
 */

/**
 * Represents a URI and label binding from a SPARQL query
 */
export interface URILabelBinding {
  uri: string | null;
  label: string | null;
}

/**
 * Represents a Geonames location result
 */
export interface GeonamesBinding extends URILabelBinding {
  toponymName?: string;
  geonameId?: string;
  countryCode?: string;
  functionClass?: string;
  functionCode?: string;
}

/**
 * Represents an Ordnance Survey binding
 */
export interface OSBinding extends URILabelBinding {
  type?: string;
}

/**
 * Configuration for SPARQL clients
 */
export interface ClientConfig {
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Geonames API configuration
 */
export interface GeonamesConfig extends ClientConfig {
  username: string;
}

/**
 * Standard SPARQL JSON result format
 */
export interface SparqlResults {
  head: {
    vars: string[];
  };
  results: {
    bindings: SparqlBinding[];
  };
}

/**
 * Individual SPARQL binding
 */
export interface SparqlBinding {
  [key: string]: {
    type: string;
    value: string;
    'xml:lang'?: string;
  };
}

/**
 * Custom error for linked data operations
 */
export class LinkedDataError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'LinkedDataError';
    Object.setPrototypeOf(this, LinkedDataError.prototype);
  }
}
