# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-11-23

### Added
- Complete TypeScript rewrite of the entire codebase
- Modern async/await API using Promises
- Comprehensive type definitions
- CLI tool for command-line usage
- Automatic retry logic with exponential backoff
- Custom `LinkedDataError` class for better error handling
- HTTP client wrapper with configurable timeout and retries
- Jest test suite with unit tests
- ESLint and Prettier for code quality
- Comprehensive documentation including README and MIGRATION guide
- Support for both CommonJS and ESM modules
- Source maps for debugging

### Changed
- **BREAKING**: All methods are now asynchronous (return Promises)
- **BREAKING**: Changed from static methods to instance-based clients
- **BREAKING**: Geonames username now configured at client instantiation
- **BREAKING**: All clients must be instantiated before use
- Improved error handling with detailed error information
- Modern HTTP client (axios) instead of deprecated Apache HttpClient
- URL encoding now uses native JavaScript `encodeURIComponent`
- Better separation of concerns with dedicated utility modules

### Removed
- **BREAKING**: Removed all Java code and dependencies
- **BREAKING**: Removed Maven build system (replaced with npm)
- Removed deprecated Apache HTTP Client
- Removed org.json.simple (replaced with native JSON parsing)

### Fixed
- Proper error handling for network failures
- Better validation of input parameters
- Improved handling of malformed responses

### Migration
See [MIGRATION.md](./MIGRATION.md) for detailed migration instructions from v1.0.

## [1.0.0] - Original Release

### Added
- Initial Java implementation
- SPARQL clients for DBPedia, Geonames, Library of Congress, and Ordnance Survey
- Basic data bindings for results
- String and XML utility functions
- Maven build configuration
- Basic unit tests

[2.0.0]: https://github.com/mcharno/linked-data-toolkit/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/mcharno/linked-data-toolkit/releases/tag/v1.0.0
