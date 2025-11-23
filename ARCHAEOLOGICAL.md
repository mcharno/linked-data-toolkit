# Archaeological & Heritage Linked Data

This document provides detailed information about the archaeological and heritage-specific clients in the Linked Data Toolkit, following best practices from the Internet Archaeology community and implementing FAIR data principles.

## Overview

The toolkit now includes comprehensive support for archaeological and heritage linked open data sources, implementing recommendations from [Internet Archaeology 59.7](https://intarch.ac.uk/journal/issue59/7/ia.59.7.pdf) and integrating with key archaeological data infrastructures.

## Supported Archaeological Data Sources

### 1. Nomisma (Numismatics)

**Website:** [http://nomisma.org/](http://nomisma.org/)
**SPARQL Endpoint:** http://nomisma.org/sparql

Nomisma.org provides stable digital representations of numismatic concepts according to Linked Open Data principles.

**Key Features:**
- Search for coins, mints, denominations, materials
- Find issuing authorities (rulers, states)
- Query by period, region, or material
- Access to extensive numismatic ontology

**Usage:**
```typescript
import { NomismaClient } from '@charno/linked-data-toolkit';

const client = new NomismaClient();

// Search for denarius coins
const denarii = await client.findDenominations('denarius');

// Find mints in Rome
const romeMints = await client.findMints('Rome');

// Search for gold coins
const goldCoins = await client.findMaterials('gold');

// Find authorities
const emperors = await client.findAuthorities('Augustus');
```

**CLI:**
```bash
linked-data-toolkit nomisma search "denarius"
linked-data-toolkit nomisma mints "Rome"
```

**Sources:**
- [Nomisma.org](http://nomisma.org/)
- [Nomisma SPARQL Endpoint](http://nomisma.org/sparql/)
- [DAI - Nomisma.org Project](https://www.dainst.org/en/research/projects/nomismaorg-a-linked-data-approach-to-numismatics/2098)

### 2. Heritage Data UK

**Website:** [https://www.heritagedata.org/](https://www.heritagedata.org/)
**SPARQL Endpoint:** http://heritagedata.org/live/sparql

Provides FISH (Forum on Information Standards in Heritage) controlled vocabularies for UK heritage data.

**Available Vocabularies:**
- Monument Types (EH_TMT2)
- Archaeological Objects (MDA_OBJ)
- Periods (EH_PERIOD)
- Building Materials (EH_TBM)
- Maritime Craft (EH_TMC)
- Archaeological Sciences (EH_ASD)

**Usage:**
```typescript
import { HeritageDataClient, HeritageVocabulary } from '@charno/linked-data-toolkit';

const client = new HeritageDataClient();

// Search monument types
const castles = await client.searchMonumentTypes('castle');

// Search object types
const pottery = await client.searchObjectTypes('pottery');

// Search periods
const romanPeriod = await client.searchPeriods('Roman');

// Get hierarchical relationships
const broader = await client.getBroaderConcepts(uri);
const narrower = await client.getNarrowerConcepts(uri);
```

**CLI:**
```bash
linked-data-toolkit heritage monuments "castle"
linked-data-toolkit heritage objects "pottery"
linked-data-toolkit heritage periods "Roman"
```

**Sources:**
- [Heritage Data Vocabularies](https://www.heritagedata.org/blog/vocabularies-provided/)
- [Historic England Data Standards](https://historicengland.org.uk/advice/technical-advice/information-management/data-standards-terminology/)

### 3. Getty Art & Architecture Thesaurus (AAT)

**Website:** [https://www.getty.edu/research/tools/vocabularies/](https://www.getty.edu/research/tools/vocabularies/)
**SPARQL Endpoint:** https://vocab.getty.edu/sparql

The AAT is a structured vocabulary for describing visual and material culture, essential for archaeology and museum documentation.

**Usage:**
```typescript
import { GettyAATClient, AATFacet } from '@charno/linked-data-toolkit';

const client = new GettyAATClient();

// Search all terms
const results = await client.searchTerms('amphora');

// Search specific facets
const materials = await client.searchMaterials('bronze');
const objects = await client.searchObjectTypes('vessel');
const periods = await client.searchStylesAndPeriods('Roman');
const activities = await client.searchActivities('excavation');

// Explore hierarchies
const broader = await client.getBroaderTerms(uri);
const narrower = await client.getNarrowerTerms(uri);
const related = await client.getRelatedTerms(uri);
```

**CLI:**
```bash
linked-data-toolkit getty search "amphora"
linked-data-toolkit getty materials "bronze"
```

**Sources:**
- [Getty Vocabularies as LOD](https://www.getty.edu/research/tools/vocabularies/lod/index.html)
- [Getty AAT SPARQL Endpoint](https://vocab.getty.edu/sparql)

### 4. Archaeology Data Service (ADS)

**Website:** [https://archaeologydataservice.ac.uk/](https://archaeologydataservice.ac.uk/)
**SPARQL Endpoint:** https://data.archaeologydataservice.ac.uk/sparql

The UK's digital repository for archaeological research data, grey literature, and datasets.

**Usage:**
```typescript
import { ADSClient } from '@charno/linked-data-toolkit';

const client = new ADSClient();

// Search archives by keyword
const villas = await client.searchArchives('Roman villa');

// Search by period
const romanArchives = await client.searchByPeriod('Roman');

// Search by subject/monument type
const settlements = await client.searchBySubject('settlement');

// Search by location
const yorkArchives = await client.searchByLocation('York');

// Search by contributor
const archives = await client.searchByContributor('University of York');
```

**CLI:**
```bash
linked-data-toolkit ads search "Roman villa"
linked-data-toolkit ads period "Roman"
```

**Sources:**
- [ADS Linked Open Data](https://data.archaeologydataservice.ac.uk/page/)
- [ADS SPARQL Query Interface](https://data.archaeologydataservice.ac.uk/query/)

### 5. NFDI4Objects Knowledge Graph

**Website:** [https://www.nfdi4objects.net/](https://www.nfdi4objects.net/)
**SPARQL Endpoint:** https://graph.nfdi4objects.net/api/sparql

German research data infrastructure for cultural heritage objects, using CIDOC-CRM and the Linked Archaeological Data Ontology (LADO).

**Usage:**
```typescript
import { NFDI4ObjectsClient } from '@charno/linked-data-toolkit';

const client = new NFDI4ObjectsClient();

// Search collections
const collections = await client.searchCollections('pottery');

// Search objects
const objects = await client.searchObjects('Roman coin');

// Search by material
const ceramics = await client.searchByMaterial('ceramic');

// Search by period
const romanObjects = await client.searchByPeriod('Roman');

// Search using LADO ontology
const entities = await client.searchArchaeologicalEntities('burial');
```

**CLI:**
```bash
linked-data-toolkit nfdi collections "pottery"
linked-data-toolkit nfdi objects "Roman coin"
```

**Sources:**
- [NFDI4Objects Portal](https://www.nfdi4objects.net/en/portal/services/)
- [N4O Graph APIs](https://github.com/nfdi4objects/n4o-graph-apis)
- [archaeology.link Data Hub](https://www.archcalc.cnr.it/journal/articles/1328)

### 6. PeriodO (Period Gazetteer)

**Website:** [https://perio.do/](https://perio.do/)
**Format:** JSON-LD (not SPARQL)

A gazetteer of scholarly definitions of historical, art-historical, and archaeological periods.

**Usage:**
```typescript
import { PeriodOHelper } from '@charno/linked-data-toolkit';

const periodo = new PeriodOHelper();

// Download the complete dataset (cache this!)
const dataset = await periodo.getDataset();

// Search for periods by keyword
const romanPeriods = periodo.searchPeriods(dataset, 'Roman', 20);

// Find periods by place (Pleiades URI)
const periods = periodo.findPeriodsByPlace(
  dataset,
  'https://pleiades.stoa.org/places/423025',
  50
);

// Find periods by date range (-753 to 476 CE)
const periods = periodo.findPeriodsByDateRange(dataset, -753, 476, 50);

// Get specific period
const period = await periodo.getPeriodByUri('http://n2t.net/ark:/99152/p0...');
```

**Sources:**
- [PeriodO Website](https://perio.do/)
- [PeriodO Technical Overview](https://perio.do/technical-overview/)

## Best Practices & Standards

### FAIR Data Principles

All clients implement FAIR (Findable, Accessible, Interoperable, Reusable) principles:

1. **Findable:** All resources have persistent URIs
2. **Accessible:** SPARQL endpoints are publicly accessible
3. **Interoperable:** Use standard ontologies (CIDOC-CRM, SKOS, Dublin Core)
4. **Reusable:** Clear licensing and provenance information

### Recommended Vocabularies & Ontologies

Based on Internet Archaeology 59.7 recommendations:

- **CIDOC-CRM:** Core ontology for cultural heritage
- **SKOS:** For controlled vocabularies and thesauri
- **Dublin Core:** Basic metadata elements
- **FOAF:** People and organizations
- **GeoSPARQL:** Geographic data
- **OWL-Time:** Temporal information

### Integration Patterns

**1. Cross-referencing:**
```typescript
// Link Getty AAT materials with Heritage Data objects
const aatMaterial = await gettyClient.searchMaterials('bronze');
const heritageObjects = await heritageClient.searchObjectTypes('bronze tool');
```

**2. Temporal alignment:**
```typescript
// Use PeriodO to standardize periods across sources
const periodoDef = periodo.searchPeriods(dataset, 'Roman Britain');
const adsArchives = await adsClient.searchByPeriod('Roman');
const heritageTypes = await heritageClient.searchPeriods('Roman');
```

**3. Geographic linking:**
```typescript
// Combine geographic authorities
const pleiadesPlace = 'https://pleiades.stoa.org/places/79574'; // Londinium
const periodoPeriods = periodo.findPeriodsByPlace(dataset, pleiadesPlace);
const adsArchives = await adsClient.searchByLocation('London');
```

## Additional Resources

### Other Important Sources

**Pleiades Gazetteer:** [https://pleiades.stoa.org/](https://pleiades.stoa.org/)
Ancient places and geographic entities

**Pelagios Network:** [https://pelagios.org/](https://pelagios.org/)
Linking historical places across resources

**ARIADNE Portal:** [https://portal.ariadne-infrastructure.eu/](https://portal.ariadne-infrastructure.eu/)
European archaeological research data

**Open Context:** [https://opencontext.org/](https://opencontext.org/)
Archaeological data publication platform

### Further Reading

- Binding et al. (2023). "Linked Data for the Historic Environment." Internet Archaeology 59. [https://intarch.ac.uk/journal/issue59/7/full-text.html](https://intarch.ac.uk/journal/issue59/7/full-text.html)
- Rabinowitz et al. "PeriodO: A gazetteer of period assertions for linking and visualizing periodized data"
- ARIADNE project documentation on archaeological data standards

## Citation

If you use these clients in your research, please cite:

```
Charno, M. (2025). Linked Data Toolkit for Archaeological Research (Version 2.0.0).
https://github.com/mcharno/linked-data-toolkit
```

And cite the individual data providers as per their requirements.
