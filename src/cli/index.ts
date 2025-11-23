#!/usr/bin/env node

/**
 * CLI for the Linked Data Toolkit
 */

import { Command } from 'commander';
import { DBPediaClient } from '../clients/dbpedia-client.js';
import { GeonamesClient } from '../clients/geonames-client.js';
import { LoCSubjectClient } from '../clients/loc-client.js';
import { OSClient } from '../clients/os-client.js';
import { NomismaClient } from '../clients/nomisma-client.js';
import { HeritageDataClient, HeritageVocabulary } from '../clients/heritage-data-client.js';
import { GettyAATClient } from '../clients/getty-aat-client.js';
import { ADSClient } from '../clients/ads-client.js';
import { NFDI4ObjectsClient } from '../clients/nfdi4objects-client.js';

const program = new Command();

program
  .name('linked-data-toolkit')
  .description('CLI for querying linked data sources and SPARQL endpoints including archaeological/heritage databases')
  .version('2.0.0');

// DBPedia commands
const dbpedia = program.command('dbpedia').description('Query DBPedia');

dbpedia
  .command('organization')
  .description('Look up an organization in DBPedia')
  .argument('<name>', 'Organization name to search for')
  .option('-m, --max <number>', 'Maximum number of results', '10')
  .action(async (name: string, options: { max: string }) => {
    try {
      const client = new DBPediaClient();
      const results = await client.lookupOrganization(name, parseInt(options.max));

      if (results.length === 0) {
        console.log('No results found.');
        return;
      }

      console.log(`Found ${results.length} result(s):\n`);
      for (const result of results) {
        console.log(`URI: ${result.uri}`);
        console.log(`Label: ${result.label}`);
        console.log('---');
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

dbpedia
  .command('thing')
  .description('Look up a thing in DBPedia')
  .argument('<name>', 'Thing to search for')
  .action(async (name: string) => {
    try {
      const client = new DBPediaClient();
      const uri = await client.lookupSingleThing(name);

      if (!uri) {
        console.log('No results found.');
        return;
      }

      console.log(`URI: ${uri}`);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Geonames commands
const geonames = program.command('geonames').description('Query Geonames');

geonames
  .command('location')
  .description('Look up a location in Geonames')
  .argument('<name>', 'Location name to search for')
  .option('-u, --username <username>', 'Geonames username (required)')
  .option('-c, --country <code>', 'Country code (e.g., GB, US)')
  .option('--continent <code>', 'Continent code (e.g., EU, NA)')
  .option('-m, --max <number>', 'Maximum number of results', '10')
  .option('-f, --fuzzy', 'Use fuzzy matching', false)
  .action(
    async (
      name: string,
      options: {
        username?: string;
        country?: string;
        continent?: string;
        max: string;
        fuzzy: boolean;
      }
    ) => {
      try {
        if (!options.username) {
          console.error('Error: Geonames username is required. Use -u or --username');
          process.exit(1);
        }

        const client = new GeonamesClient({ username: options.username });
        const maxResults = parseInt(options.max);

        let results: Map<string, any>;

        if (options.country) {
          results = options.fuzzy
            ? await client.lookupFuzzyLocationInCountry(name, options.country, maxResults)
            : await client.lookupPreciseLocationInCountry(name, options.country, maxResults);
        } else if (options.continent) {
          results = options.fuzzy
            ? await client.lookupFuzzyLocationInContinent(name, options.continent, maxResults)
            : await client.lookupPreciseLocationInContinent(name, options.continent, maxResults);
        } else {
          results = await client.lookupPreciseLocationInWorld(name, maxResults);
        }

        if (results.size === 0) {
          console.log('No results found.');
          return;
        }

        console.log(`Found ${results.size} result(s):\n`);
        for (const [uri, binding] of results) {
          console.log(`URI: ${uri}`);
          console.log(`Name: ${binding.toponymName}`);
          console.log(`Country: ${binding.countryCode}`);
          console.log(`Feature Class: ${binding.functionClass}`);
          console.log(`Feature Code: ${binding.functionCode}`);
          console.log('---');
        }
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    }
  );

// Library of Congress commands
const loc = program.command('loc').description('Query Library of Congress');

loc
  .command('subject')
  .description('Look up a subject heading')
  .argument('<subject>', 'Subject to search for')
  .option('-e, --exact', 'Exact match', false)
  .option('-s, --starts-with', 'Starts with match', false)
  .option('--endpoint <url>', 'Custom SPARQL endpoint URL')
  .action(
    async (subject: string, options: { exact: boolean; startsWith: boolean; endpoint?: string }) => {
      try {
        const client = new LoCSubjectClient(options.endpoint);

        let results;
        if (options.exact) {
          results = await client.lookupSubjectExact(subject);
        } else if (options.startsWith) {
          results = await client.lookupSubjectStartsWith(subject);
        } else {
          results = await client.lookupSubjectFuzzy(subject);
        }

        if (results.length === 0) {
          console.log('No results found.');
          return;
        }

        console.log(`Found ${results.length} result(s):\n`);
        for (const result of results) {
          console.log(`URI: ${result.uri}`);
          console.log(`Label: ${result.label}`);
          console.log('---');
        }
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    }
  );

// Ordnance Survey commands
const os = program.command('os').description('Query Ordnance Survey');

os.command('location')
  .description('Look up a UK location')
  .argument('<name>', 'Location name to search for')
  .option('-m, --max <number>', 'Maximum number of results', '10')
  .option('-f, --fuzzy', 'Use fuzzy matching', false)
  .action(async (name: string, options: { max: string; fuzzy: boolean }) => {
    try {
      const client = new OSClient();
      const maxResults = parseInt(options.max);

      const results = options.fuzzy
        ? await client.lookupFuzzyLocation(name, maxResults)
        : await client.lookupPreciseLocation(name, maxResults);

      if (results.size === 0) {
        console.log('No results found.');
        return;
      }

      console.log(`Found ${results.size} result(s):\n`);
      for (const [uri, binding] of results) {
        console.log(`URI: ${uri}`);
        console.log(`Label: ${binding.label}`);
        if (binding.type) {
          console.log(`Type: ${binding.type}`);
        }
        console.log('---');
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Nomisma commands (Numismatics)
const nomisma = program.command('nomisma').description('Query Nomisma numismatic data');

nomisma
  .command('search')
  .description('Search for numismatic concepts')
  .argument('<keyword>', 'Search term')
  .option('-m, --max <number>', 'Maximum number of results', '20')
  .action(async (keyword: string, options: { max: string }) => {
    try {
      const client = new NomismaClient();
      const results = await client.searchConcepts(keyword, parseInt(options.max));

      if (results.length === 0) {
        console.log('No results found.');
        return;
      }

      console.log(`Found ${results.length} result(s):\n`);
      for (const result of results) {
        console.log(`URI: ${result.uri}`);
        console.log(`Label: ${result.label}`);
        console.log('---');
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

nomisma
  .command('mints')
  .description('Find coin mints by location')
  .argument('<location>', 'Mint location')
  .option('-m, --max <number>', 'Maximum number of results', '20')
  .action(async (location: string, options: { max: string }) => {
    try {
      const client = new NomismaClient();
      const results = await client.findMints(location, parseInt(options.max));

      if (results.length === 0) {
        console.log('No results found.');
        return;
      }

      console.log(`Found ${results.length} mint(s):\n`);
      for (const result of results) {
        console.log(`URI: ${result.uri}`);
        console.log(`Label: ${result.label}`);
        console.log('---');
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Heritage Data UK commands
const heritage = program.command('heritage').description('Query Heritage Data UK vocabularies');

heritage
  .command('monuments')
  .description('Search monument types')
  .argument('<keyword>', 'Search term (e.g., "castle", "villa")')
  .option('-m, --max <number>', 'Maximum number of results', '20')
  .action(async (keyword: string, options: { max: string }) => {
    try {
      const client = new HeritageDataClient();
      const results = await client.searchMonumentTypes(keyword, parseInt(options.max));

      if (results.length === 0) {
        console.log('No results found.');
        return;
      }

      console.log(`Found ${results.length} monument type(s):\n`);
      for (const result of results) {
        console.log(`URI: ${result.uri}`);
        console.log(`Label: ${result.label}`);
        console.log('---');
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

heritage
  .command('objects')
  .description('Search archaeological object types')
  .argument('<keyword>', 'Search term (e.g., "pottery", "coin")')
  .option('-m, --max <number>', 'Maximum number of results', '20')
  .action(async (keyword: string, options: { max: string }) => {
    try {
      const client = new HeritageDataClient();
      const results = await client.searchObjectTypes(keyword, parseInt(options.max));

      if (results.length === 0) {
        console.log('No results found.');
        return;
      }

      console.log(`Found ${results.length} object type(s):\n`);
      for (const result of results) {
        console.log(`URI: ${result.uri}`);
        console.log(`Label: ${result.label}`);
        console.log('---');
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

heritage
  .command('periods')
  .description('Search period definitions')
  .argument('<keyword>', 'Search term (e.g., "Roman", "Medieval")')
  .option('-m, --max <number>', 'Maximum number of results', '20')
  .action(async (keyword: string, options: { max: string }) => {
    try {
      const client = new HeritageDataClient();
      const results = await client.searchPeriods(keyword, parseInt(options.max));

      if (results.length === 0) {
        console.log('No results found.');
        return;
      }

      console.log(`Found ${results.length} period(s):\n`);
      for (const result of results) {
        console.log(`URI: ${result.uri}`);
        console.log(`Label: ${result.label}`);
        console.log('---');
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Getty AAT commands
const getty = program.command('getty').description('Query Getty Art & Architecture Thesaurus');

getty
  .command('search')
  .description('Search AAT terms')
  .argument('<keyword>', 'Search term')
  .option('-m, --max <number>', 'Maximum number of results', '20')
  .action(async (keyword: string, options: { max: string }) => {
    try {
      const client = new GettyAATClient();
      const results = await client.searchTerms(keyword, undefined, parseInt(options.max));

      if (results.length === 0) {
        console.log('No results found.');
        return;
      }

      console.log(`Found ${results.length} term(s):\n`);
      for (const result of results) {
        console.log(`URI: ${result.uri}`);
        console.log(`Label: ${result.label}`);
        console.log('---');
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

getty
  .command('materials')
  .description('Search material types')
  .argument('<material>', 'Material name (e.g., "bronze", "ceramic")')
  .option('-m, --max <number>', 'Maximum number of results', '20')
  .action(async (material: string, options: { max: string }) => {
    try {
      const client = new GettyAATClient();
      const results = await client.searchMaterials(material, parseInt(options.max));

      if (results.length === 0) {
        console.log('No results found.');
        return;
      }

      console.log(`Found ${results.length} material(s):\n`);
      for (const result of results) {
        console.log(`URI: ${result.uri}`);
        console.log(`Label: ${result.label}`);
        console.log('---');
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// ADS commands
const ads = program.command('ads').description('Query Archaeology Data Service');

ads
  .command('search')
  .description('Search ADS archives')
  .argument('<keyword>', 'Search term')
  .option('-m, --max <number>', 'Maximum number of results', '20')
  .action(async (keyword: string, options: { max: string }) => {
    try {
      const client = new ADSClient();
      const results = await client.searchArchives(keyword, parseInt(options.max));

      if (results.length === 0) {
        console.log('No results found.');
        return;
      }

      console.log(`Found ${results.length} archive(s):\n`);
      for (const result of results) {
        console.log(`URI: ${result.uri}`);
        console.log(`Title: ${result.label}`);
        console.log('---');
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

ads
  .command('period')
  .description('Search archives by period')
  .argument('<period>', 'Period name (e.g., "Roman", "Medieval")')
  .option('-m, --max <number>', 'Maximum number of results', '20')
  .action(async (period: string, options: { max: string }) => {
    try {
      const client = new ADSClient();
      const results = await client.searchByPeriod(period, parseInt(options.max));

      if (results.length === 0) {
        console.log('No results found.');
        return;
      }

      console.log(`Found ${results.length} archive(s):\n`);
      for (const result of results) {
        console.log(`URI: ${result.uri}`);
        console.log(`Title: ${result.label}`);
        console.log('---');
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// NFDI4Objects commands
const nfdi = program.command('nfdi').description('Query NFDI4Objects knowledge graph');

nfdi
  .command('collections')
  .description('Search collections')
  .argument('<keyword>', 'Search term')
  .option('-m, --max <number>', 'Maximum number of results', '20')
  .action(async (keyword: string, options: { max: string }) => {
    try {
      const client = new NFDI4ObjectsClient();
      const results = await client.searchCollections(keyword, parseInt(options.max));

      if (results.length === 0) {
        console.log('No results found.');
        return;
      }

      console.log(`Found ${results.length} collection(s):\n`);
      for (const result of results) {
        console.log(`URI: ${result.uri}`);
        console.log(`Title: ${result.label}`);
        console.log('---');
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

nfdi
  .command('objects')
  .description('Search cultural heritage objects')
  .argument('<keyword>', 'Search term')
  .option('-m, --max <number>', 'Maximum number of results', '20')
  .action(async (keyword: string, options: { max: string }) => {
    try {
      const client = new NFDI4ObjectsClient();
      const results = await client.searchObjects(keyword, parseInt(options.max));

      if (results.length === 0) {
        console.log('No results found.');
        return;
      }

      console.log(`Found ${results.length} object(s):\n`);
      for (const result of results) {
        console.log(`URI: ${result.uri}`);
        console.log(`Label: ${result.label}`);
        console.log('---');
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse();
