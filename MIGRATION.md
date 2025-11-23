# Migration Guide: v1.0 (Java) to v2.0 (TypeScript)

This guide helps you migrate from the original Java-based version (v1.0) to the modern TypeScript implementation (v2.0).

## Overview of Changes

Version 2.0 is a **complete rewrite** from Java to TypeScript with the following major changes:

- ✅ Modern async/await API (no more blocking calls)
- ✅ Promise-based instead of synchronous
- ✅ Instance-based clients instead of static methods
- ✅ Proper error handling with custom error types
- ✅ TypeScript type safety
- ✅ Both library and CLI usage
- ✅ Improved configuration options
- ✅ Retry logic with exponential backoff

## Breaking Changes

### 1. Static Methods → Instance Methods

**v1.0 (Java):**
```java
List<URILabelBinding> results = DBPediaClient.lookupOrganization("Microsoft", 10);
```

**v2.0 (TypeScript):**
```typescript
const client = new DBPediaClient();
const results = await client.lookupOrganization("Microsoft", 10);
```

### 2. Synchronous → Asynchronous

All methods are now asynchronous and return Promises.

**v1.0 (Java):**
```java
// Blocking call
List<URILabelBinding> results = DBPediaClient.lookupOrganization("Microsoft", 10);
processResults(results);
```

**v2.0 (TypeScript):**
```typescript
// Non-blocking async/await
const results = await client.lookupOrganization("Microsoft", 10);
processResults(results);

// Or with promises
client.lookupOrganization("Microsoft", 10)
  .then(results => processResults(results))
  .catch(error => console.error(error));
```

### 3. Return Types

**Maps and Lists:**

**v1.0 (Java):**
```java
Map<String, GeonamesBinding> results = GeonamesClient.lookupPreciseLocationInCountry("London", "GB", 10, "username");
```

**v2.0 (TypeScript):**
```typescript
const client = new GeonamesClient({ username: "your_username" });
const results: Map<string, GeonamesBinding> = await client.lookupPreciseLocationInCountry("London", "GB", 10);
```

### 4. Configuration

**v1.0 (Java):**
```java
// Username passed as parameter every time
Map<String, GeonamesBinding> results = GeonamesClient.lookupPreciseLocationInCountry(
    "London", "GB", 10, "username"
);
```

**v2.0 (TypeScript):**
```typescript
// Username configured once at instantiation
const client = new GeonamesClient({
  username: "your_username",
  timeout: 30000,
  maxRetries: 3
});
const results = await client.lookupPreciseLocationInCountry("London", "GB", 10);
```

### 5. Error Handling

**v1.0 (Java):**
```java
try {
    List<URILabelBinding> results = DBPediaClient.lookupOrganization("Test", 10);
} catch (Exception e) {
    e.printStackTrace();
}
```

**v2.0 (TypeScript):**
```typescript
import { LinkedDataError } from '@charno/linked-data-toolkit';

try {
    const results = await client.lookupOrganization("Test", 10);
} catch (error) {
    if (error instanceof LinkedDataError) {
        console.error('Error:', error.message);
        console.error('Status Code:', error.statusCode);
        console.error('Error Code:', error.code);
    }
}
```

## Migration Examples

### DBPedia Client

**v1.0 (Java):**
```java
import net.charno.semweb.lookups.DBPediaClient;
import net.charno.semweb.bindings.URILabelBinding;
import java.util.List;

List<URILabelBinding> orgs = DBPediaClient.lookupOrganization("Microsoft", 10);
for (URILabelBinding org : orgs) {
    System.out.println(org.getUri() + " - " + org.getLabel());
}

String uri = DBPediaClient.lookupSingleThing("London");
System.out.println(uri);
```

**v2.0 (TypeScript):**
```typescript
import { DBPediaClient, URILabelBinding } from '@charno/linked-data-toolkit';

const client = new DBPediaClient();

const orgs: URILabelBinding[] = await client.lookupOrganization("Microsoft", 10);
for (const org of orgs) {
    console.log(`${org.uri} - ${org.label}`);
}

const uri: string | null = await client.lookupSingleThing("London");
console.log(uri);
```

### Geonames Client

**v1.0 (Java):**
```java
import net.charno.semweb.lookups.GeonamesClient;
import net.charno.semweb.bindings.GeonamesBinding;
import java.util.Map;

Map<String, GeonamesBinding> locations = GeonamesClient.lookupPreciseLocationInCountry(
    "London", "GB", 10, "myusername"
);

for (Map.Entry<String, GeonamesBinding> entry : locations.entrySet()) {
    System.out.println(entry.getKey() + " - " + entry.getValue().getToponymName());
}
```

**v2.0 (TypeScript):**
```typescript
import { GeonamesClient, GeonamesBinding } from '@charno/linked-data-toolkit';

const client = new GeonamesClient({ username: "myusername" });

const locations: Map<string, GeonamesBinding> = await client.lookupPreciseLocationInCountry(
    "London", "GB", 10
);

for (const [uri, binding] of locations) {
    console.log(`${uri} - ${binding.toponymName}`);
}
```

### Library of Congress Client

**v1.0 (Java):**
```java
import net.charno.semweb.lookups.LoCSubjectClient;
import net.charno.semweb.bindings.URILabelBinding;
import java.util.List;

List<URILabelBinding> subjects = LoCSubjectClient.lookupSubjectFuzzy("archaeology");
for (URILabelBinding subject : subjects) {
    System.out.println(subject.getUri() + " - " + subject.getLabel());
}
```

**v2.0 (TypeScript):**
```typescript
import { LoCSubjectClient, URILabelBinding } from '@charno/linked-data-toolkit';

const client = new LoCSubjectClient();

const subjects: URILabelBinding[] = await client.lookupSubjectFuzzy("archaeology");
for (const subject of subjects) {
    console.log(`${subject.uri} - ${subject.label}`);
}
```

### Ordnance Survey Client

**v1.0 (Java):**
```java
import net.charno.semweb.lookups.OSClient;
import net.charno.semweb.bindings.OSBinding;
import java.util.Map;

Map<String, OSBinding> locations = OSClient.lookupFuzzyLocation("Manchester", 10);
for (Map.Entry<String, OSBinding> entry : locations.entrySet()) {
    System.out.println(entry.getKey());
}
```

**v2.0 (TypeScript):**
```typescript
import { OSClient, OSBinding } from '@charno/linked-data-toolkit';

const client = new OSClient();

const locations: Map<string, OSBinding> = await client.lookupFuzzyLocation("Manchester", 10);
for (const [uri, binding] of locations) {
    console.log(uri);
}
```

## Utility Functions

### String Utils

**v1.0 (Java):**
```java
import net.charno.utils.StringUtils;

String safe = StringUtils.makeURLSafe("hello world");
String capitalized = StringUtils.capitalise("hello");
```

**v2.0 (TypeScript):**
```typescript
import { makeURLSafe, capitalize } from '@charno/linked-data-toolkit';

const safe = makeURLSafe("hello world");
const capitalized = capitalize("hello");
```

## New Features in v2.0

### 1. Configuration Options

```typescript
const client = new DBPediaClient({
  timeout: 30000,      // Request timeout
  maxRetries: 3,       // Retry attempts
  retryDelay: 1000     // Initial retry delay
});
```

### 2. Better Error Information

```typescript
try {
  const results = await client.lookupOrganization("test");
} catch (error) {
  if (error instanceof LinkedDataError) {
    console.error('HTTP Status:', error.statusCode);
    console.error('Error Code:', error.code);
    console.error('Message:', error.message);
  }
}
```

### 3. CLI Tool

```bash
# Now available as a CLI
linked-data-toolkit dbpedia organization "Microsoft" --max 5
linked-data-toolkit geonames location "London" -u username --country GB
```

### 4. Type Safety

```typescript
// Full TypeScript type definitions
import type {
  URILabelBinding,
  GeonamesBinding,
  OSBinding,
  ClientConfig
} from '@charno/linked-data-toolkit';
```

## Recommended Migration Strategy

1. **Install the new version**
   ```bash
   npm install @charno/linked-data-toolkit
   ```

2. **Update imports**
   - Change from Java imports to TypeScript imports
   - Use named imports for better tree-shaking

3. **Instantiate clients**
   - Create client instances instead of using static methods
   - Configure clients at instantiation time

4. **Add async/await**
   - All method calls must be awaited or use `.then()`
   - Wrap in async functions if needed

5. **Update error handling**
   - Use try/catch with LinkedDataError
   - Check error types and properties

6. **Test thoroughly**
   - Run your test suite
   - Verify all lookups work as expected

## Support

For issues or questions about migration, please file an issue on GitHub or contact michael@charno.net.

## Version History

- **v1.0.0**: Original Java implementation
- **v2.0.0**: Complete TypeScript rewrite with modern patterns
