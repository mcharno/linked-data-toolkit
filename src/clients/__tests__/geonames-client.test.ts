/**
 * Tests for GeonamesClient
 */

import { GeonamesClient } from '../geonames-client';
import { LinkedDataError } from '../../types';

// Mock the http client
jest.mock('../../utils/http-client', () => {
  return {
    HttpClient: jest.fn().mockImplementation(() => ({
      get: jest.fn(),
    })),
  };
});

describe('GeonamesClient', () => {
  const mockUsername = 'test_user';

  describe('constructor', () => {
    it('should require username', () => {
      expect(() => {
        new GeonamesClient({ username: '' });
      }).toThrow(LinkedDataError);
    });

    it('should create client with valid username', () => {
      const client = new GeonamesClient({ username: mockUsername });
      expect(client).toBeInstanceOf(GeonamesClient);
    });
  });

  describe('parseGeonamesJSON', () => {
    it('should parse valid Geonames response', () => {
      const client = new GeonamesClient({ username: mockUsername });

      const mockJSON = JSON.stringify({
        geonames: [
          {
            geonameId: 2643743,
            toponymName: 'London',
            countryCode: 'GB',
            fcl: 'P',
            fcode: 'PPLC',
          },
        ],
      });

      const results = (client as any).parseGeonamesJSON(mockJSON);
      expect(results.size).toBe(1);

      const londonResult = results.get('http://sws.geonames.org/2643743');
      expect(londonResult).toBeDefined();
      expect(londonResult?.toponymName).toBe('London');
      expect(londonResult?.countryCode).toBe('GB');
    });

    it('should handle empty results', () => {
      const client = new GeonamesClient({ username: mockUsername });

      const mockJSON = JSON.stringify({
        geonames: [],
      });

      const results = (client as any).parseGeonamesJSON(mockJSON);
      expect(results.size).toBe(0);
    });
  });
});
