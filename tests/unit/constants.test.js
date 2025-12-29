/**
 * Unit Tests for constants.js
 *
 * Tests that all required constants are defined with the expected structure.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { loadModule, getModulePath } from '../helpers/loadModule.js';

describe('Constants Module', () => {
  let ctx;

  beforeAll(() => {
    ctx = loadModule(getModulePath('constants.js'));
  });

  describe('DOOR_SPECS', () => {
    it('should be defined', () => {
      expect(ctx.DOOR_SPECS).toBeDefined();
    });

    it('should contain expected door styles', () => {
      expect(ctx.DOOR_SPECS.shaker).toBeDefined();
      expect(ctx.DOOR_SPECS.flat).toBeDefined();
      expect(ctx.DOOR_SPECS.raised).toBeDefined();
      expect(ctx.DOOR_SPECS.glass).toBeDefined();
    });

    it('should have required properties for shaker doors', () => {
      const shaker = ctx.DOOR_SPECS.shaker;
      expect(shaker.railWidth).toBeTypeOf('number');
      expect(shaker.stileWidth).toBeTypeOf('number');
      expect(shaker.panelThickness).toBeTypeOf('number');
      expect(shaker.panelSetback).toBeTypeOf('number');
    });

    it('should have required properties for flat doors', () => {
      const flat = ctx.DOOR_SPECS.flat;
      expect(flat.thickness).toBeTypeOf('number');
    });

    it('should have required properties for raised panel doors', () => {
      const raised = ctx.DOOR_SPECS.raised;
      expect(raised.railWidth).toBeTypeOf('number');
      expect(raised.stileWidth).toBeTypeOf('number');
      expect(raised.centerRaise).toBeTypeOf('number');
    });

    it('should have required properties for glass doors', () => {
      const glass = ctx.DOOR_SPECS.glass;
      expect(glass.railWidth).toBeTypeOf('number');
      expect(glass.stileWidth).toBeTypeOf('number');
      expect(glass.glassThickness).toBeTypeOf('number');
    });

    it('should have positive dimension values', () => {
      expect(ctx.DOOR_SPECS.shaker.railWidth).toBeGreaterThan(0);
      expect(ctx.DOOR_SPECS.flat.thickness).toBeGreaterThan(0);
    });
  });

  describe('DRAWER_BOX', () => {
    it('should be defined', () => {
      expect(ctx.DRAWER_BOX).toBeDefined();
    });

    it('should have required properties', () => {
      expect(ctx.DRAWER_BOX.sideThickness).toBeTypeOf('number');
      expect(ctx.DRAWER_BOX.bottomThickness).toBeTypeOf('number');
      expect(ctx.DRAWER_BOX.frontBackHeight).toBeTypeOf('number');
      expect(ctx.DRAWER_BOX.slidesClearance).toBeTypeOf('number');
    });

    it('should have positive values', () => {
      expect(ctx.DRAWER_BOX.sideThickness).toBeGreaterThan(0);
      expect(ctx.DRAWER_BOX.bottomThickness).toBeGreaterThan(0);
      expect(ctx.DRAWER_BOX.frontBackHeight).toBeGreaterThan(0);
      expect(ctx.DRAWER_BOX.slidesClearance).toBeGreaterThan(0);
    });
  });

  describe('HINGE_TYPES', () => {
    it('should be defined as an array', () => {
      expect(ctx.HINGE_TYPES).toBeDefined();
      expect(Array.isArray(ctx.HINGE_TYPES)).toBe(true);
    });

    it('should contain expected hinge options', () => {
      expect(ctx.HINGE_TYPES).toContain('Concealed (Blum)');
      expect(ctx.HINGE_TYPES).toContain('Concealed (Grass)');
      expect(ctx.HINGE_TYPES).toContain('European');
      expect(ctx.HINGE_TYPES).toContain('Butt Hinge');
    });

    it('should have at least 3 options', () => {
      expect(ctx.HINGE_TYPES.length).toBeGreaterThanOrEqual(3);
    });

    it('should have string values', () => {
      ctx.HINGE_TYPES.forEach((hinge) => {
        expect(hinge).toBeTypeOf('string');
      });
    });
  });

  describe('SLIDE_TYPES', () => {
    it('should be defined as an array', () => {
      expect(ctx.SLIDE_TYPES).toBeDefined();
      expect(Array.isArray(ctx.SLIDE_TYPES)).toBe(true);
    });

    it('should contain expected slide options', () => {
      expect(ctx.SLIDE_TYPES).toContain('Undermount (Blum)');
      expect(ctx.SLIDE_TYPES).toContain('Side Mount');
      expect(ctx.SLIDE_TYPES).toContain('Center Mount');
      expect(ctx.SLIDE_TYPES).toContain('Soft-Close');
    });

    it('should have at least 3 options', () => {
      expect(ctx.SLIDE_TYPES.length).toBeGreaterThanOrEqual(3);
    });

    it('should have string values', () => {
      ctx.SLIDE_TYPES.forEach((slide) => {
        expect(slide).toBeTypeOf('string');
      });
    });
  });

  describe('PULL_TYPES', () => {
    it('should be defined as an array', () => {
      expect(ctx.PULL_TYPES).toBeDefined();
      expect(Array.isArray(ctx.PULL_TYPES)).toBe(true);
    });

    it('should contain expected pull options', () => {
      expect(ctx.PULL_TYPES).toContain('Bar Pull');
      expect(ctx.PULL_TYPES).toContain('Cup Pull');
      expect(ctx.PULL_TYPES).toContain('Knob');
      expect(ctx.PULL_TYPES).toContain('Edge Pull');
      expect(ctx.PULL_TYPES).toContain('Recessed');
    });

    it('should have at least 3 options', () => {
      expect(ctx.PULL_TYPES.length).toBeGreaterThanOrEqual(3);
    });

    it('should have string values', () => {
      ctx.PULL_TYPES.forEach((pull) => {
        expect(pull).toBeTypeOf('string');
      });
    });
  });

  describe('CONSTRUCTION_TYPES', () => {
    it('should be defined', () => {
      expect(ctx.CONSTRUCTION_TYPES).toBeDefined();
    });

    it('should contain frameless type', () => {
      expect(ctx.CONSTRUCTION_TYPES.frameless).toBeDefined();
      expect(ctx.CONSTRUCTION_TYPES.frameless.name).toBeTypeOf('string');
      expect(ctx.CONSTRUCTION_TYPES.frameless.description).toBeTypeOf('string');
    });

    it('should contain faceFrame type with dimensions', () => {
      expect(ctx.CONSTRUCTION_TYPES.faceFrame).toBeDefined();
      expect(ctx.CONSTRUCTION_TYPES.faceFrame.name).toBeTypeOf('string');
      expect(ctx.CONSTRUCTION_TYPES.faceFrame.description).toBeTypeOf('string');
      expect(ctx.CONSTRUCTION_TYPES.faceFrame.frameWidth).toBeTypeOf('number');
      expect(ctx.CONSTRUCTION_TYPES.faceFrame.frameThickness).toBeTypeOf('number');
    });
  });
});
