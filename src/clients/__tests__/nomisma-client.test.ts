/**
 * Tests for NomismaClient
 */

import { NomismaClient } from '../nomisma-client';

// Mock the http client
jest.mock('../../utils/http-client', () => {
  return {
    HttpClient: jest.fn().mockImplementation(() => ({
      get: jest.fn(),
    })),
  };
});

describe('NomismaClient', () => {
  let client: NomismaClient;

  beforeEach(() => {
    client = new NomismaClient();
  });

  describe('searchConcepts', () => {
    it('should create client instance', () => {
      expect(client).toBeInstanceOf(NomismaClient);
    });

    it('should validate results count', () => {
      const validatedCount = (client as any).validateResultsCount(150);
      expect(validatedCount).toBe(100);
    });

    it('should escape SPARQL special characters', () => {
      const escaped = (client as any).escapeSparql('test"value');
      expect(escaped).toContain('\\"');
    });
  });

  describe('SPARQL query construction', () => {
    it('should properly encode query parameters', async () => {
      const mockGet = jest.fn().mockResolvedValue('{"results": {"bindings": []}}');
      (client as any).httpClient.get = mockGet;

      await client.searchConcepts('denarius', 10);

      expect(mockGet).toHaveBeenCalled();
      const callUrl = mockGet.mock.calls[0][0];
      expect(callUrl).toContain('http://nomisma.org/sparql');
      expect(callUrl).toContain('format=json');
    });
  });
});
