# Legacy Java Implementation (v1.0.0)

This directory contains the original Java implementation of the Linked Data Toolkit.

## ⚠️ Deprecated

This code has been **superseded by the TypeScript implementation (v2.0.0)** in the main `src/` directory.

The Java version is preserved here for:
- Historical reference
- Code archaeology
- Understanding the original design
- Recovering specific Java implementations if needed

## What's Here

- `main/` - Original Java source code
- `test/` - Original Java tests
- `pom.xml` - Maven build configuration
- `linked-data-toolkit.iml` - IntelliJ IDEA project file
- `circle.yml` - Original CircleCI configuration

## Original Structure

```
legacy/main/java/net/charno/
├── gml/                    # GML (Geographic Markup Language) handling
├── semweb/
│   ├── bindings/          # Data binding classes
│   ├── harvesters/        # CRM Objects harvester
│   ├── loaders/           # Data loaders
│   └── lookups/           # SPARQL client implementations
└── utils/                 # Utility classes
```

## Running the Java Version

To use the original Java implementation:

1. **Check out the tagged version:**
   ```bash
   git checkout v1.0.0-java
   ```

2. **Build with Maven:**
   ```bash
   mvn clean install
   ```

3. **Use in your Java project:**
   ```xml
   <dependency>
       <groupId>net.charno</groupId>
       <artifactId>linked-data-toolkit</artifactId>
       <version>1.0-SNAPSHOT</version>
   </dependency>
   ```

## Differences from TypeScript Version

| Feature | Java v1.0 | TypeScript v2.0 |
|---------|-----------|-----------------|
| **Language** | Java | TypeScript |
| **API Style** | Static methods | Instance methods |
| **Async** | Blocking/synchronous | Async/await |
| **HTTP Client** | Apache HttpClient (deprecated) | Axios |
| **Build Tool** | Maven | npm/tsup |
| **Module System** | JAR | CommonJS + ESM |
| **CLI** | No | Yes |
| **Archaeological Clients** | No | Yes (6 new clients) |

## Migration

For migrating from Java v1.0 to TypeScript v2.0, see the main repository's [MIGRATION.md](../MIGRATION.md).

## Why Was It Rewritten?

The TypeScript rewrite (v2.0.0) provides:
- Modern async/await patterns
- Better TypeScript/JavaScript ecosystem integration
- Dual usage (library + CLI)
- Comprehensive archaeological data support
- Better error handling
- Modern tooling and development experience
- npm package distribution

## License

The original Java code is licensed under MIT, same as the TypeScript version.

## Questions?

For questions about the Java version, please open an issue referencing the `v1.0.0-java` tag.

For new development, use the TypeScript version (v2.0.0+).
