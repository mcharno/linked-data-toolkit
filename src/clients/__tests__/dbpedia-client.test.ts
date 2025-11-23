/**
 * Tests for DBPediaClient
 */

import { DBPediaClient } from '../dbpedia-client';

// Mock the http client
jest.mock('../../utils/http-client', () => {
  return {
    HttpClient: jest.fn().mockImplementation(() => ({
      get: jest.fn(),
    })),
  };
});

describe('DBPediaClient', () => {
  let client: DBPediaClient;

  beforeEach(() => {
    client = new DBPediaClient();
  });

  describe('lookupOrganization', () => {
    it('should create client instance', () => {
      expect(client).toBeInstanceOf(DBPediaClient);
    });

    it('should validate results count', () => {
      const validatedCount = (client as any).validateResultsCount(150);
      expect(validatedCount).toBe(100);
    });

    it('should accept valid results count', () => {
      const validatedCount = (client as any).validateResultsCount(50);
      expect(validatedCount).toBe(50);
    });
  });

  describe('parseStandardJSON', () => {
    it('should parse valid SPARQL JSON results', () => {
      const mockJSON = JSON.stringify({
        results: {
          bindings: [
            {
              uri: { value: 'http://dbpedia.org/resource/Test' },
              label: { value: 'Test Organization' },
            },
          ],
        },
      });

      const results = (client as any).parseStandardJSON(mockJSON);
      expect(results).toHaveLength(1);
      expect(results[0].uri).toBe('http://dbpedia.org/resource/Test');
      expect(results[0].label).toBe('Test Organization');
    });

    it('should handle empty results', () => {
      const mockJSON = JSON.stringify({
        results: {
          bindings: [],
        },
      });

      const results = (client as any).parseStandardJSON(mockJSON);
      expect(results).toHaveLength(0);
    });

    it('should handle malformed JSON gracefully', () => {
      const results = (client as any).parseStandardJSON('invalid json');
      expect(results).toHaveLength(0);
    });
  });
});
