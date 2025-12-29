/**
 * Unit Tests for measurements.js
 *
 * Tests the fraction parsing and conversion utilities used throughout
 * the cabinet designer for handling measurement inputs.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { loadModule, getModulePath } from '../helpers/loadModule.js';

describe('Measurements Module', () => {
  let ctx;

  beforeAll(() => {
    ctx = loadModule(getModulePath('measurements.js'));
  });

  describe('parseFraction()', () => {
    it('should return number if already a number', () => {
      expect(ctx.parseFraction(36)).toBe(36);
      expect(ctx.parseFraction(0.5)).toBe(0.5);
      expect(ctx.parseFraction(0)).toBe(0);
    });

    it('should parse whole numbers as strings', () => {
      expect(ctx.parseFraction('36')).toBe(36);
      expect(ctx.parseFraction('0')).toBe(0);
      expect(ctx.parseFraction('100')).toBe(100);
    });

    it('should parse decimal strings', () => {
      expect(ctx.parseFraction('36.5')).toBe(36.5);
      expect(ctx.parseFraction('0.75')).toBe(0.75);
      expect(ctx.parseFraction('1.125')).toBe(1.125);
    });

    it('should parse simple fractions', () => {
      expect(ctx.parseFraction('3/4')).toBe(0.75);
      expect(ctx.parseFraction('1/2')).toBe(0.5);
      expect(ctx.parseFraction('1/4')).toBe(0.25);
      expect(ctx.parseFraction('1/8')).toBe(0.125);
      expect(ctx.parseFraction('1/16')).toBe(0.0625);
      expect(ctx.parseFraction('3/8')).toBe(0.375);
    });

    it('should parse mixed numbers (whole + fraction)', () => {
      expect(ctx.parseFraction('1 1/2')).toBe(1.5);
      expect(ctx.parseFraction('2 3/4')).toBe(2.75);
      expect(ctx.parseFraction('36 3/8')).toBe(36.375);
      expect(ctx.parseFraction('12 1/4')).toBe(12.25);
    });

    it('should handle trailing quote marks', () => {
      expect(ctx.parseFraction('3/4"')).toBe(0.75);
      expect(ctx.parseFraction('1 1/2"')).toBe(1.5);
      expect(ctx.parseFraction('36"')).toBe(36);
    });

    it('should return 0 for empty string', () => {
      expect(ctx.parseFraction('')).toBe(0);
      expect(ctx.parseFraction('  ')).toBe(0);
    });

    it('should handle whitespace', () => {
      expect(ctx.parseFraction('  36  ')).toBe(36);
      expect(ctx.parseFraction('  3/4  ')).toBe(0.75);
    });

    it('should return 0 for invalid input', () => {
      expect(ctx.parseFraction('abc')).toBe(0);
      expect(ctx.parseFraction('invalid')).toBe(0);
    });
  });

  describe('decimalToFraction()', () => {
    it('should format whole numbers', () => {
      expect(ctx.decimalToFraction(36)).toBe('36"');
      expect(ctx.decimalToFraction(1)).toBe('1"');
      expect(ctx.decimalToFraction(24)).toBe('24"');
    });

    it('should format zero', () => {
      expect(ctx.decimalToFraction(0)).toBe('0"');
    });

    it('should format simple fractions', () => {
      expect(ctx.decimalToFraction(0.5)).toBe('1/2"');
      expect(ctx.decimalToFraction(0.25)).toBe('1/4"');
      expect(ctx.decimalToFraction(0.75)).toBe('3/4"');
    });

    it('should format eighths', () => {
      expect(ctx.decimalToFraction(0.125)).toBe('1/8"');
      expect(ctx.decimalToFraction(0.375)).toBe('3/8"');
      expect(ctx.decimalToFraction(0.625)).toBe('5/8"');
      expect(ctx.decimalToFraction(0.875)).toBe('7/8"');
    });

    it('should format sixteenths', () => {
      expect(ctx.decimalToFraction(0.0625)).toBe('1/16"');
      expect(ctx.decimalToFraction(0.1875)).toBe('3/16"');
    });

    it('should format mixed numbers', () => {
      expect(ctx.decimalToFraction(1.5)).toBe('1 1/2"');
      expect(ctx.decimalToFraction(2.75)).toBe('2 3/4"');
      expect(ctx.decimalToFraction(36.375)).toBe('36 3/8"');
    });

    it('should round to nearest 32nd', () => {
      // 0.33 * 32 = 10.56, rounds to 11, so 11/32"
      expect(ctx.decimalToFraction(0.33)).toBe('11/32"');
    });
  });

  describe('formatMeasurement()', () => {
    it('should return 0" for zero or negative values', () => {
      expect(ctx.formatMeasurement(0)).toBe('0"');
      expect(ctx.formatMeasurement(-1)).toBe('0"');
    });

    it('should format with both fraction and decimal', () => {
      const result = ctx.formatMeasurement(1.5);
      expect(result).toContain('1 1/2"');
      expect(result).toContain('1.500');
    });

    it('should format whole numbers', () => {
      const result = ctx.formatMeasurement(36);
      expect(result).toContain('36"');
      expect(result).toContain('36.000');
    });
  });
});
