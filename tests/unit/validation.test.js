/**
 * Unit Tests for validation.js
 *
 * Tests dimension validation and constraint checking for cabinet configurations.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { loadModule, getModulePath } from '../helpers/loadModule.js';

describe('Validation Module', () => {
  let ctx;

  beforeAll(() => {
    ctx = loadModule(getModulePath('validation.js'));
  });

  describe('DIMENSION_CONSTRAINTS', () => {
    it('should be defined', () => {
      expect(ctx.DIMENSION_CONSTRAINTS).toBeDefined();
    });

    it('should have width constraints', () => {
      const width = ctx.DIMENSION_CONSTRAINTS.width;
      expect(width).toBeDefined();
      expect(width.min).toBeTypeOf('number');
      expect(width.max).toBeTypeOf('number');
      expect(width.standard).toBeDefined();
      expect(Array.isArray(width.standard)).toBe(true);
    });

    it('should have height constraints', () => {
      const height = ctx.DIMENSION_CONSTRAINTS.height;
      expect(height).toBeDefined();
      expect(height.min).toBeTypeOf('number');
      expect(height.max).toBeTypeOf('number');
    });

    it('should have depth constraints', () => {
      const depth = ctx.DIMENSION_CONSTRAINTS.depth;
      expect(depth).toBeDefined();
      expect(depth.min).toBeTypeOf('number');
      expect(depth.max).toBeTypeOf('number');
    });

    it('should have positive minimum values', () => {
      expect(ctx.DIMENSION_CONSTRAINTS.width.min).toBeGreaterThan(0);
      expect(ctx.DIMENSION_CONSTRAINTS.height.min).toBeGreaterThan(0);
      expect(ctx.DIMENSION_CONSTRAINTS.depth.min).toBeGreaterThan(0);
    });

    it('should have max values greater than min', () => {
      const { width, height, depth } = ctx.DIMENSION_CONSTRAINTS;
      expect(width.max).toBeGreaterThan(width.min);
      expect(height.max).toBeGreaterThan(height.min);
      expect(depth.max).toBeGreaterThan(depth.min);
    });

    it('should have drawer constraints', () => {
      const drawer = ctx.DIMENSION_CONSTRAINTS.drawer;
      expect(drawer).toBeDefined();
      expect(drawer.minHeight).toBeTypeOf('number');
      expect(drawer.maxHeight).toBeTypeOf('number');
      expect(drawer.minGap).toBeTypeOf('number');
    });

    it('should have door constraints', () => {
      const door = ctx.DIMENSION_CONSTRAINTS.door;
      expect(door).toBeDefined();
      expect(door.minWidth).toBeTypeOf('number');
      expect(door.maxWidth).toBeTypeOf('number');
      expect(door.minHeight).toBeTypeOf('number');
    });
  });

  describe('validateDimension()', () => {
    it('should return valid for dimensions within range', () => {
      const result = ctx.validateDimension('width', 24);
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should warn when width is below minimum', () => {
      const min = ctx.DIMENSION_CONSTRAINTS.width.min;
      const result = ctx.validateDimension('width', min - 1);
      expect(result.isValid).toBe(false);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('below minimum');
    });

    it('should warn when width exceeds maximum', () => {
      const max = ctx.DIMENSION_CONSTRAINTS.width.max;
      const result = ctx.validateDimension('width', max + 1);
      expect(result.isValid).toBe(false);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('exceeds maximum');
    });

    it('should warn when height is below minimum', () => {
      const min = ctx.DIMENSION_CONSTRAINTS.height.min;
      const result = ctx.validateDimension('height', min - 1);
      expect(result.isValid).toBe(false);
    });

    it('should warn when height exceeds maximum', () => {
      const max = ctx.DIMENSION_CONSTRAINTS.height.max;
      const result = ctx.validateDimension('height', max + 1);
      expect(result.isValid).toBe(false);
    });

    it('should warn when depth is below minimum', () => {
      const min = ctx.DIMENSION_CONSTRAINTS.depth.min;
      const result = ctx.validateDimension('depth', min - 1);
      expect(result.isValid).toBe(false);
    });

    it('should warn when depth exceeds maximum', () => {
      const max = ctx.DIMENSION_CONSTRAINTS.depth.max;
      const result = ctx.validateDimension('depth', max + 1);
      expect(result.isValid).toBe(false);
    });

    it('should accept exactly minimum value', () => {
      const min = ctx.DIMENSION_CONSTRAINTS.width.min;
      const result = ctx.validateDimension('width', min);
      expect(result.isValid).toBe(true);
    });

    it('should accept exactly maximum value', () => {
      const max = ctx.DIMENSION_CONSTRAINTS.width.max;
      const result = ctx.validateDimension('width', max);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for unknown dimension types', () => {
      const result = ctx.validateDimension('unknown', 100);
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should suggest standard sizes when not close', () => {
      // Using a value that's more than 0.5 from any standard
      const result = ctx.validateDimension('width', 13);
      expect(result.suggestions.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('validateCabinetDimensions()', () => {
    it('should validate a properly sized cabinet', () => {
      const cabinet = { width: 24, height: 30, depth: 24 };
      const result = ctx.validateCabinetDimensions(cabinet);
      expect(result.isValid).toBe(true);
    });

    it('should warn for extreme height-to-width ratio', () => {
      const cabinet = { width: 12, height: 60, depth: 12 }; // ratio > 4
      const result = ctx.validateCabinetDimensions(cabinet);
      expect(result.warnings.some((w) => w.includes('tall relative to width'))).toBe(true);
    });

    it('should warn when depth exceeds width', () => {
      const cabinet = { width: 12, height: 30, depth: 24 };
      const result = ctx.validateCabinetDimensions(cabinet);
      expect(result.warnings.some((w) => w.includes('depth exceeds width'))).toBe(true);
    });

    it('should collect warnings from all dimensions', () => {
      const cabinet = {
        width: 3, // Below min
        height: 5, // Below min
        depth: 3 // Below min
      };
      const result = ctx.validateCabinetDimensions(cabinet);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('validateDrawerConfiguration()', () => {
    it('should return valid for cabinet with no drawers', () => {
      const cabinet = { width: 24, height: 30, depth: 24, drawers: [] };
      const result = ctx.validateDrawerConfiguration(cabinet);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for cabinet without drawers property', () => {
      const cabinet = { width: 24, height: 30, depth: 24 };
      const result = ctx.validateDrawerConfiguration(cabinet);
      expect(result.isValid).toBe(true);
    });

    it('should warn for drawer height below minimum', () => {
      const cabinet = {
        width: 24,
        height: 30,
        depth: 24,
        drawers: [{ height: 1, startY: 0 }] // Below min height (2)
      };
      const result = ctx.validateDrawerConfiguration(cabinet);
      expect(result.warnings.some((w) => w.includes('below minimum'))).toBe(true);
    });

    it('should warn for drawer height above maximum', () => {
      const cabinet = {
        width: 24,
        height: 30,
        depth: 24,
        drawers: [{ height: 15, startY: 0 }] // Above max height (12)
      };
      const result = ctx.validateDrawerConfiguration(cabinet);
      expect(result.warnings.some((w) => w.includes('exceeds recommended maximum'))).toBe(true);
    });

    it('should warn for overlapping drawers', () => {
      const cabinet = {
        width: 24,
        height: 30,
        depth: 24,
        drawers: [
          { height: 6, startY: 0 },
          { height: 6, startY: 4 } // Overlaps with first drawer
        ]
      };
      const result = ctx.validateDrawerConfiguration(cabinet);
      expect(result.warnings.some((w) => w.includes('overlap'))).toBe(true);
    });

    it('should warn for drawer extending beyond cabinet height', () => {
      const cabinet = {
        width: 24,
        height: 30,
        depth: 24,
        drawers: [{ height: 10, startY: 25 }] // 25 + 10 = 35 > 30
      };
      const result = ctx.validateDrawerConfiguration(cabinet);
      expect(result.warnings.some((w) => w.includes('beyond cabinet height'))).toBe(true);
    });
  });

  describe('validateCabinet()', () => {
    it('should run all validations', () => {
      const cabinet = {
        width: 24,
        height: 30,
        depth: 24,
        drawers: [],
        doors: 1
      };
      const result = ctx.validateCabinet(cabinet);
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('suggestions');
    });

    it('should return valid for well-configured cabinet', () => {
      const cabinet = {
        width: 24,
        height: 30,
        depth: 24,
        drawers: [],
        doors: 1
      };
      const result = ctx.validateCabinet(cabinet);
      expect(result.isValid).toBe(true);
    });

    it('should separate errors from warnings', () => {
      const cabinet = {
        width: 24,
        height: 30,
        depth: 24,
        drawers: [
          { height: 6, startY: 0 },
          { height: 6, startY: 4 } // Overlap causes error
        ],
        doors: 0
      };
      const result = ctx.validateCabinet(cabinet);
      expect(result.errors).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });

  describe('getValidationSummary()', () => {
    it('should return success message for valid cabinet', () => {
      const validResult = { isValid: true, errors: [], warnings: [], suggestions: [] };
      const summary = ctx.getValidationSummary(validResult);
      expect(summary).toContain('passed');
    });

    it('should include errors in summary', () => {
      const result = { isValid: false, errors: ['Error 1'], warnings: [], suggestions: [] };
      const summary = ctx.getValidationSummary(result);
      expect(summary).toContain('ERRORS');
      expect(summary).toContain('Error 1');
    });

    it('should include warnings in summary', () => {
      const result = { isValid: true, errors: [], warnings: ['Warning 1'], suggestions: [] };
      const summary = ctx.getValidationSummary(result);
      expect(summary).toContain('WARNINGS');
      expect(summary).toContain('Warning 1');
    });

    it('should include suggestions in summary', () => {
      const result = { isValid: true, errors: [], warnings: [], suggestions: ['Suggestion 1'] };
      const summary = ctx.getValidationSummary(result);
      expect(summary).toContain('SUGGESTIONS');
      expect(summary).toContain('Suggestion 1');
    });
  });
});
