#!/usr/bin/env node

/**
 * CLI for the Linked Data Toolkit
 */

import { Command } from 'commander';
import { DBPediaClient } from '../clients/dbpedia-client.js';
import { GeonamesClient } from '../clients/geonames-client.js';
import { LoCSubjectClient } from '../clients/loc-client.js';
import { OSClient } from '../clients/os-client.js';

const program = new Command();

program
  .name('linked-data-toolkit')
  .description('CLI for querying linked data sources and SPARQL endpoints')
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

program.parse();
