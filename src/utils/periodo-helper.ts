/**
 * PeriodO helper utilities
 *
 * PeriodO is a gazetteer of scholarly definitions of historical periods.
 * Unlike other clients, it uses JSON-LD rather than SPARQL.
 */

import { HttpClient } from './http-client.js';

/**
 * PeriodO period definition
 */
export interface PeriodOPeriod {
  id: string;
  label?: string;
  spatialCoverage?: Array<{
    id: string;
    label?: string;
  }>;
  start?: {
    in?: number;
    earliest?: number;
    latest?: number;
  };
  stop?: {
    in?: number;
    earliest?: number;
    latest?: number;
  };
  source?: {
    id: string;
    title?: string;
  };
}

/**
 * Helper class for working with PeriodO period definitions
 *
 * @example
 * ```typescript
 * const periodo = new PeriodOHelper();
 * const dataset = await periodo.getDataset();
 * const periods = periodo.searchPeriods(dataset, 'Roman');
 * ```
 */
export class PeriodOHelper {
  private static readonly PERIODO_URL = 'https://perio.do/';
  private static readonly DATASET_URL = `${PeriodOHelper.PERIODO_URL}data.json`;

  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient({ timeout: 60000 }); // Longer timeout for large dataset
  }

  /**
   * Downloads the complete PeriodO dataset
   * Note: This is a large file (~10MB+) and should be cached
   *
   * @returns Complete PeriodO dataset
   */
  async getDataset(): Promise<any> {
    return this.httpClient.get(PeriodOHelper.DATASET_URL);
  }

  /**
   * Searches for periods by keyword in labels
   *
   * @param dataset - PeriodO dataset (from getDataset())
   * @param keyword - Search term
   * @param limit - Maximum number of results
   * @returns Array of matching periods
   */
  searchPeriods(dataset: any, keyword: string, limit: number = 20): PeriodOPeriod[] {
    const results: PeriodOPeriod[] = [];
    const lowerKeyword = keyword.toLowerCase();

    // Navigate the nested PeriodO structure
    if (!dataset.periodCollections) {
      return results;
    }

    for (const collectionId in dataset.periodCollections) {
      const collection = dataset.periodCollections[collectionId];

      if (collection.definitions) {
        for (const definitionId in collection.definitions) {
          const definition = collection.definitions[definitionId];

          const label = definition.label || '';
          const note = definition.note || '';
          const localizedLabels = definition.localizedLabels
            ? Object.values(definition.localizedLabels).flat()
            : [];

          // Check if keyword appears in any text field
          const matchesLabel = label.toLowerCase().includes(lowerKeyword);
          const matchesNote = note.toLowerCase().includes(lowerKeyword);
          const matchesLocalized = localizedLabels.some((l: any) =>
            String(l).toLowerCase().includes(lowerKeyword)
          );

          if (matchesLabel || matchesNote || matchesLocalized) {
            results.push({
              id: definitionId,
              label: label,
              spatialCoverage: definition.spatialCoverage,
              start: definition.start,
              stop: definition.stop,
              source: definition.source,
            });

            if (results.length >= limit) {
              return results;
            }
          }
        }
      }
    }

    return results;
  }

  /**
   * Finds periods that cover a specific place
   *
   * @param dataset - PeriodO dataset
   * @param placeUri - Place URI (e.g., from Pleiades)
   * @param limit - Maximum number of results
   * @returns Array of periods covering that place
   */
  findPeriodsByPlace(dataset: any, placeUri: string, limit: number = 50): PeriodOPeriod[] {
    const results: PeriodOPeriod[] = [];

    if (!dataset.periodCollections) {
      return results;
    }

    for (const collectionId in dataset.periodCollections) {
      const collection = dataset.periodCollections[collectionId];

      if (collection.definitions) {
        for (const definitionId in collection.definitions) {
          const definition = collection.definitions[definitionId];

          if (definition.spatialCoverage) {
            const matchesPlace = definition.spatialCoverage.some(
              (place: any) => place.id === placeUri
            );

            if (matchesPlace) {
              results.push({
                id: definitionId,
                label: definition.label,
                spatialCoverage: definition.spatialCoverage,
                start: definition.start,
                stop: definition.stop,
                source: definition.source,
              });

              if (results.length >= limit) {
                return results;
              }
            }
          }
        }
      }
    }

    return results;
  }

  /**
   * Finds periods within a date range
   *
   * @param dataset - PeriodO dataset
   * @param startYear - Start year (negative for BCE)
   * @param endYear - End year (negative for BCE)
   * @param limit - Maximum number of results
   * @returns Array of periods overlapping that range
   */
  findPeriodsByDateRange(
    dataset: any,
    startYear: number,
    endYear: number,
    limit: number = 50
  ): PeriodOPeriod[] {
    const results: PeriodOPeriod[] = [];

    if (!dataset.periodCollections) {
      return results;
    }

    for (const collectionId in dataset.periodCollections) {
      const collection = dataset.periodCollections[collectionId];

      if (collection.definitions) {
        for (const definitionId in collection.definitions) {
          const definition = collection.definitions[definitionId];

          // Check if period overlaps with the requested range
          const periodStart = definition.start?.earliest || definition.start?.in;
          const periodEnd = definition.stop?.latest || definition.stop?.in;

          if (periodStart !== undefined && periodEnd !== undefined) {
            const overlaps = periodStart <= endYear && periodEnd >= startYear;

            if (overlaps) {
              results.push({
                id: definitionId,
                label: definition.label,
                spatialCoverage: definition.spatialCoverage,
                start: definition.start,
                stop: definition.stop,
                source: definition.source,
              });

              if (results.length >= limit) {
                return results;
              }
            }
          }
        }
      }
    }

    return results;
  }

  /**
   * Gets a specific period by its URI
   *
   * @param periodUri - Full PeriodO URI
   * @returns Period definition or null
   */
  async getPeriodByUri(periodUri: string): Promise<any> {
    try {
      const response = await this.httpClient.get(`${periodUri}.json`);
      return response;
    } catch (error) {
      console.error('Failed to fetch period:', error);
      return null;
    }
  }
}
