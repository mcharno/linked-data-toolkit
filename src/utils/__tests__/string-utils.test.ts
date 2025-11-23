/**
 * Tests for string utility functions
 */

import { makeURLSafe, capitalize, isValidUri } from '../string-utils';

describe('StringUtils', () => {
  describe('makeURLSafe', () => {
    it('should encode special characters', () => {
      expect(makeURLSafe('hello world')).toBe('hello%20world');
      expect(makeURLSafe('test&value')).toBe('test%26value');
      expect(makeURLSafe('query=test')).toBe('query%3Dtest');
    });

    it('should handle already encoded strings', () => {
      const input = 'simple-string_123';
      expect(makeURLSafe(input)).toBe(input);
    });

    it('should encode complex strings', () => {
      const input = 'test@example.com?param=value&foo=bar';
      const encoded = makeURLSafe(input);
      expect(encoded).not.toContain('@');
      expect(encoded).not.toContain('?');
      expect(encoded).not.toContain('&');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });

    it('should handle already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('should handle strings with leading whitespace', () => {
      expect(capitalize('  hello')).toBe('Hello');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
      expect(capitalize('   ')).toBe('');
    });

    it('should only capitalize first letter', () => {
      expect(capitalize('hello world')).toBe('Hello world');
    });
  });

  describe('isValidUri', () => {
    it('should validate correct URIs', () => {
      expect(isValidUri('http://example.com')).toBe(true);
      expect(isValidUri('https://example.com/path')).toBe(true);
      expect(isValidUri('http://dbpedia.org/resource/London')).toBe(true);
    });

    it('should reject invalid URIs', () => {
      expect(isValidUri('not a uri')).toBe(false);
      expect(isValidUri('ftp:/invalid')).toBe(false);
      expect(isValidUri('')).toBe(false);
    });

    it('should handle URIs with query parameters', () => {
      expect(isValidUri('http://example.com?query=test&foo=bar')).toBe(true);
    });
  });
});
