/**
 * Unit Tests for cabinetClasses.js
 *
 * Tests the Cabinet, Door, Drawer, and CabinetComponent classes.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { loadModule, getModulePath } from '../helpers/loadModule.js';

describe('Cabinet Classes Module', () => {
  let ctx;

  beforeAll(() => {
    // First load constants (dependency for cabinetClasses)
    const constantsCtx = loadModule(getModulePath('constants.js'));

    // Then load cabinetClasses with constants preloaded
    ctx = loadModule(getModulePath('cabinetClasses.js'), {
      SLIDE_TYPES: constantsCtx.SLIDE_TYPES,
      PULL_TYPES: constantsCtx.PULL_TYPES,
      HINGE_TYPES: constantsCtx.HINGE_TYPES,
      DOOR_SPECS: constantsCtx.DOOR_SPECS
    });
  });

  describe('CabinetComponent', () => {
    it('should set dimensions from constructor', () => {
      const component = new ctx.CabinetComponent(24, 30, 12);
      expect(component.width).toBe(24);
      expect(component.height).toBe(30);
      expect(component.depth).toBe(12);
    });

    it('should set material from constructor', () => {
      const component = new ctx.CabinetComponent(24, 30, 12, 'Maple');
      expect(component.material).toBe('Maple');
    });

    it('should default to Oak material', () => {
      const component = new ctx.CabinetComponent(24, 30, 12);
      expect(component.material).toBe('Oak');
    });

    it('should set thickness from constructor', () => {
      const component = new ctx.CabinetComponent(24, 30, 12, 'Oak', 0.5);
      expect(component.thickness).toBe(0.5);
    });

    it('should default to 0.75 thickness', () => {
      const component = new ctx.CabinetComponent(24, 30, 12);
      expect(component.thickness).toBe(0.75);
    });
  });

  describe('Drawer', () => {
    it('should set dimensions from constructor', () => {
      const drawer = new ctx.Drawer(20, 6, 18);
      expect(drawer.width).toBe(20);
      expect(drawer.height).toBe(6);
      expect(drawer.depth).toBe(18);
    });

    it('should set material from constructor', () => {
      const drawer = new ctx.Drawer(20, 6, 18, 'Birch');
      expect(drawer.material).toBe('Birch');
    });

    it('should default to Oak material', () => {
      const drawer = new ctx.Drawer(20, 6, 18);
      expect(drawer.material).toBe('Oak');
    });

    it('should set thickness from constructor', () => {
      const drawer = new ctx.Drawer(20, 6, 18, 'Oak', 0.625);
      expect(drawer.thickness).toBe(0.625);
    });

    it('should default to 0.5 thickness for drawers', () => {
      const drawer = new ctx.Drawer(20, 6, 18);
      expect(drawer.thickness).toBe(0.5);
    });

    it('should set default slide type', () => {
      const drawer = new ctx.Drawer(20, 6, 18);
      expect(drawer.slide).toBeDefined();
      expect(drawer.slide).toBeTypeOf('string');
    });

    it('should set default pull type', () => {
      const drawer = new ctx.Drawer(20, 6, 18);
      expect(drawer.pull).toBeDefined();
      expect(drawer.pull).toBeTypeOf('string');
    });

    it('should allow slide type modification', () => {
      const drawer = new ctx.Drawer(20, 6, 18);
      drawer.slide = 'Side Mount';
      expect(drawer.slide).toBe('Side Mount');
    });

    it('should allow pull type modification', () => {
      const drawer = new ctx.Drawer(20, 6, 18);
      drawer.pull = 'Cup Pull';
      expect(drawer.pull).toBe('Cup Pull');
    });
  });

  describe('Door', () => {
    it('should set dimensions from constructor', () => {
      const door = new ctx.Door(22, 28, 0.75);
      expect(door.width).toBe(22);
      expect(door.height).toBe(28);
      expect(door.depth).toBe(0.75);
    });

    it('should set material from constructor', () => {
      const door = new ctx.Door(22, 28, 0.75, 'Cherry');
      expect(door.material).toBe('Cherry');
    });

    it('should default to Oak material', () => {
      const door = new ctx.Door(22, 28, 0.75);
      expect(door.material).toBe('Oak');
    });

    it('should set door style from constructor', () => {
      const door = new ctx.Door(22, 28, 0.75, 'Oak', 0.75, 'flat');
      expect(door.doorType).toBe('flat');
    });

    it('should default to shaker style', () => {
      const door = new ctx.Door(22, 28, 0.75);
      expect(door.doorType).toBe('shaker');
    });

    it('should set default hinge type', () => {
      const door = new ctx.Door(22, 28, 0.75);
      expect(door.hinge).toBeDefined();
      expect(door.hinge).toBeTypeOf('string');
    });

    it('should set default pull type', () => {
      const door = new ctx.Door(22, 28, 0.75);
      expect(door.pull).toBeDefined();
      expect(door.pull).toBeTypeOf('string');
    });

    it('should allow door type modification', () => {
      const door = new ctx.Door(22, 28, 0.75);
      door.doorType = 'raised';
      expect(door.doorType).toBe('raised');
    });

    it('should allow hinge type modification', () => {
      const door = new ctx.Door(22, 28, 0.75);
      door.hinge = 'Butt Hinge';
      expect(door.hinge).toBe('Butt Hinge');
    });
  });

  describe('Cabinet', () => {
    describe('Constructor', () => {
      it('should set dimensions from constructor', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        expect(cabinet.width).toBe(24);
        expect(cabinet.height).toBe(30);
        expect(cabinet.depth).toBe(24);
      });

      it('should create left and right sides', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        expect(cabinet.sides).toBeDefined();
        expect(cabinet.sides.left).toBeDefined();
        expect(cabinet.sides.right).toBeDefined();
      });

      it('should create back panel', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        expect(cabinet.back).toBeDefined();
      });

      it('should initialize empty drawers array', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        expect(cabinet.drawers).toBeDefined();
        expect(Array.isArray(cabinet.drawers)).toBe(true);
        expect(cabinet.drawers.length).toBe(0);
      });

      it('should initialize door as null', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        expect(cabinet.door).toBe(null);
      });
    });

    describe('addDrawer()', () => {
      it('should add drawer to array', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        cabinet.addDrawer(20, 6, 18);
        expect(cabinet.drawers.length).toBe(1);
      });

      it('should return the created drawer', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        const drawer = cabinet.addDrawer(20, 6, 18);
        expect(drawer).toBeDefined();
        expect(drawer.width).toBe(20);
      });

      it('should add multiple drawers', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        cabinet.addDrawer(20, 6, 18);
        cabinet.addDrawer(20, 4, 18);
        cabinet.addDrawer(20, 8, 18);
        expect(cabinet.drawers.length).toBe(3);
      });

      it('should use default material and thickness', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        const drawer = cabinet.addDrawer(20, 6, 18);
        expect(drawer.material).toBe('Oak');
        expect(drawer.thickness).toBe(0.5);
      });

      it('should accept custom material and thickness', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        const drawer = cabinet.addDrawer(20, 6, 18, 'Maple', 0.625);
        expect(drawer.material).toBe('Maple');
        expect(drawer.thickness).toBe(0.625);
      });
    });

    describe('removeDrawer()', () => {
      it('should remove drawer from array', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        cabinet.addDrawer(20, 6, 18);
        cabinet.addDrawer(20, 4, 18);
        cabinet.removeDrawer(0);
        expect(cabinet.drawers.length).toBe(1);
      });

      it('should remove correct drawer by index', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        cabinet.addDrawer(20, 6, 18); // index 0
        cabinet.addDrawer(20, 4, 18); // index 1
        cabinet.addDrawer(20, 8, 18); // index 2
        cabinet.removeDrawer(1);
        expect(cabinet.drawers.length).toBe(2);
        expect(cabinet.drawers[0].height).toBe(6);
        expect(cabinet.drawers[1].height).toBe(8);
      });

      it('should not error on invalid index', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        cabinet.addDrawer(20, 6, 18);
        cabinet.removeDrawer(-1);
        cabinet.removeDrawer(5);
        expect(cabinet.drawers.length).toBe(1);
      });
    });

    describe('setDoor()', () => {
      it('should create door', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        cabinet.setDoor(22, 28, 0.75);
        expect(cabinet.door).not.toBe(null);
      });

      it('should return the created door', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        const door = cabinet.setDoor(22, 28, 0.75);
        expect(door).toBeDefined();
        expect(door.width).toBe(22);
      });

      it('should replace existing door', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        cabinet.setDoor(22, 28, 0.75);
        cabinet.setDoor(20, 26, 0.75);
        expect(cabinet.door.width).toBe(20);
      });

      it('should accept custom material', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        const door = cabinet.setDoor(22, 28, 0.75, 'Cherry');
        expect(door.material).toBe('Cherry');
      });

      it('should accept custom door type', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        const door = cabinet.setDoor(22, 28, 0.75, 'Oak', 0.75, 'flat');
        expect(door.doorType).toBe('flat');
      });
    });

    describe('removeDoor()', () => {
      it('should clear door', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        cabinet.setDoor(22, 28, 0.75);
        cabinet.removeDoor();
        expect(cabinet.door).toBe(null);
      });

      it('should not error when no door exists', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        cabinet.removeDoor();
        expect(cabinet.door).toBe(null);
      });
    });

    describe('updateSides()', () => {
      it('should update both sides', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        cabinet.updateSides(20, 28, 22, 'Maple', 0.625);
        expect(cabinet.sides.left.width).toBe(20);
        expect(cabinet.sides.left.material).toBe('Maple');
        expect(cabinet.sides.right.width).toBe(20);
        expect(cabinet.sides.right.material).toBe('Maple');
      });
    });

    describe('updateBack()', () => {
      it('should update back panel', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        cabinet.updateBack(22, 28, 'Birch', 0.25);
        expect(cabinet.back.width).toBe(22);
        expect(cabinet.back.height).toBe(28);
        expect(cabinet.back.material).toBe('Birch');
      });

      it('should default to 0.25 thickness', () => {
        const cabinet = new ctx.Cabinet(24, 30, 24);
        cabinet.updateBack(22, 28, 'Birch');
        expect(cabinet.back.thickness).toBe(0.25);
      });
    });
  });
});
