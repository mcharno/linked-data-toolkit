# Linked Data Toolkit

A modern TypeScript toolkit for SPARQL lookups against various authorities and linked data sources.

## 🌟 Version 2.0.0 - Complete TypeScript Rewrite

This is a complete modernization of the original Java-based toolkit, now written in TypeScript with modern patterns and best practices. The toolkit provides both a library for use in web applications and a CLI for command-line operations.

## Features

- **Modern TypeScript**: Fully typed with strict TypeScript configuration
- **Dual Usage**: Use as a library in your web applications or as a CLI tool
- **Multiple Data Sources**: Query DBPedia, Geonames, Library of Congress, and Ordnance Survey
- **Async/Await**: Modern promise-based API
- **Error Handling**: Comprehensive error handling with custom error types
- **Retry Logic**: Automatic retry with exponential backoff for network errors
- **Well Tested**: Comprehensive test suite with Jest
- **Clean Code**: ESLint and Prettier configured for code quality

## Supported Data Sources

- **DBPedia**: Query the DBPedia knowledge base for organizations and entities
- **Geonames**: Geographic name lookups with precise and fuzzy matching
- **Library of Congress**: Subject heading lookups
- **Ordnance Survey**: UK geographic data queries

## Installation

```bash
npm install @charno/linked-data-toolkit
```

Or for CLI usage:

```bash
npm install -g @charno/linked-data-toolkit
```

## Usage

### As a Library

```typescript
import { DBPediaClient, GeonamesClient, LoCSubjectClient, OSClient } from '@charno/linked-data-toolkit';

// DBPedia example
const dbpedia = new DBPediaClient();
const organizations = await dbpedia.lookupOrganization('Microsoft', 10);
console.log(organizations);

// Geonames example (requires username)
const geonames = new GeonamesClient({ username: 'your_username' });
const locations = await geonames.lookupPreciseLocationInCountry('London', 'GB', 10);
console.log(locations);

// Library of Congress example
const loc = new LoCSubjectClient();
const subjects = await loc.lookupSubjectFuzzy('archaeology');
console.log(subjects);

// Ordnance Survey example
const os = new OSClient();
const ukLocations = await os.lookupFuzzyLocation('Manchester', 10);
console.log(ukLocations);
```

### As a CLI

```bash
# Query DBPedia
linked-data-toolkit dbpedia organization "Microsoft" --max 5
linked-data-toolkit dbpedia thing "London"

# Query Geonames (requires username)
linked-data-toolkit geonames location "London" -u your_username --country GB
linked-data-toolkit geonames location "Paris" -u your_username --fuzzy

# Query Library of Congress
linked-data-toolkit loc subject "archaeology" --exact
linked-data-toolkit loc subject "history" --starts-with

# Query Ordnance Survey
linked-data-toolkit os location "Manchester" --fuzzy --max 10
```

## API Reference

### DBPediaClient

```typescript
const client = new DBPediaClient(config?: ClientConfig);

// Look up organizations
await client.lookupOrganization(name: string, maxResults?: number): Promise<URILabelBinding[]>

// Look up a single thing
await client.lookupSingleThing(material: string): Promise<string | null>
```

### GeonamesClient

```typescript
const client = new GeonamesClient({ username: 'your_username' });

// Various lookup methods
await client.lookupPreciseLocationInCountry(location: string, country: string, maxResults?: number)
await client.lookupPreciseLocationInContinent(location: string, continent: string, maxResults?: number)
await client.lookupPreciseLocationInWorld(location: string, maxResults?: number)
await client.lookupLocationFavorUK(location: string, maxResults?: number)
await client.lookupFuzzyLocationInCountry(location: string, country: string, maxResults?: number)
await client.lookupFuzzyLocationInContinent(location: string, continent: string, maxResults?: number)
```

### LoCSubjectClient

```typescript
const client = new LoCSubjectClient(endpoint?: string);

await client.lookupSubjectExact(subject: string): Promise<URILabelBinding[]>
await client.lookupSubjectStartsWith(subject: string): Promise<URILabelBinding[]>
await client.lookupSubjectFuzzy(subject: string): Promise<URILabelBinding[]>
await client.lookupSubjectCMSValues(subject: string): Promise<URILabelBinding[]>
```

### OSClient

```typescript
const client = new OSClient();

await client.lookupPreciseLocation(location: string, maxResults?: number)
await client.lookupFuzzyLocation(location: string, maxResults?: number)
```

## Configuration

All clients accept an optional `ClientConfig` object:

```typescript
interface ClientConfig {
  timeout?: number;        // Request timeout in milliseconds (default: 30000)
  maxRetries?: number;     // Maximum number of retry attempts (default: 3)
  retryDelay?: number;     // Initial retry delay in milliseconds (default: 1000)
}
```

Geonames also requires a username:

```typescript
interface GeonamesConfig extends ClientConfig {
  username: string;  // Your Geonames username (required)
}
```

## Error Handling

The toolkit uses a custom `LinkedDataError` class for all errors:

```typescript
try {
  const results = await client.lookupOrganization('test');
} catch (error) {
  if (error instanceof LinkedDataError) {
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Status:', error.statusCode);
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## Migration from v1.0

See [MIGRATION.md](./MIGRATION.md) for detailed migration instructions from the Java-based v1.0 to the TypeScript-based v2.0.

## Requirements

- Node.js >= 18.0.0
- For Geonames: A free Geonames account and username

## License

MIT

## Author

Michael Charno <michael@charno.net>

## Original Project

This toolkit was originally developed in Java to simplify the alignment of ADS metadata with various authorities. Version 2.0 represents a complete modernization in TypeScript while maintaining the core functionality.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.