/**
 * Unit Tests for historyManager.js
 *
 * Tests the undo/redo state management functionality.
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { loadModule, getModulePath } from '../helpers/loadModule.js';

describe('History Manager Module', () => {
  let ctx;
  let HistoryManager;

  beforeAll(() => {
    ctx = loadModule(getModulePath('historyManager.js'));
    HistoryManager = ctx.HistoryManager || ctx.window?.HistoryManager;
  });

  describe('Constructor', () => {
    it('should initialize with empty history', () => {
      const manager = new HistoryManager();
      expect(manager.history).toBeDefined();
      expect(manager.history.length).toBe(0);
    });

    it('should set currentIndex to -1', () => {
      const manager = new HistoryManager();
      expect(manager.currentIndex).toBe(-1);
    });

    it('should set maxSize to 50', () => {
      const manager = new HistoryManager();
      expect(manager.maxSize).toBe(50);
    });
  });

  describe('pushState()', () => {
    it('should add state to history', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'test' }, 'Test action');
      expect(manager.history.length).toBe(1);
    });

    it('should increment currentIndex', () => {
      const manager = new HistoryManager();
      expect(manager.currentIndex).toBe(-1);
      manager.pushState({ data: 'test1' }, 'Action 1');
      expect(manager.currentIndex).toBe(0);
      manager.pushState({ data: 'test2' }, 'Action 2');
      expect(manager.currentIndex).toBe(1);
    });

    it('should store deep copy of state', () => {
      const manager = new HistoryManager();
      const original = { nested: { value: 1 } };
      manager.pushState(original, 'Test');
      original.nested.value = 2;
      expect(manager.history[0].state.nested.value).toBe(1);
    });

    it('should store description and timestamp', () => {
      const manager = new HistoryManager();
      const before = Date.now();
      manager.pushState({ data: 'test' }, 'My description');
      const after = Date.now();

      expect(manager.history[0].description).toBe('My description');
      expect(manager.history[0].timestamp).toBeGreaterThanOrEqual(before);
      expect(manager.history[0].timestamp).toBeLessThanOrEqual(after);
    });

    it('should clear redo stack when pushing after undo', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state1' }, 'Action 1');
      manager.pushState({ data: 'state2' }, 'Action 2');
      manager.pushState({ data: 'state3' }, 'Action 3');
      manager.undo();
      manager.undo();
      // Now at state1, with state2 and state3 in redo stack
      manager.pushState({ data: 'newState' }, 'New action');
      // Redo stack should be cleared
      expect(manager.canRedo()).toBe(false);
      expect(manager.history.length).toBe(2); // state1 and newState
    });

    it('should enforce 50-state limit by dropping oldest', () => {
      const manager = new HistoryManager();
      for (let i = 0; i < 55; i++) {
        manager.pushState({ index: i }, `Action ${i}`);
      }
      expect(manager.history.length).toBe(50);
      // Oldest states should be dropped
      expect(manager.history[0].state.index).toBe(5);
    });
  });

  describe('undo()', () => {
    it('should return previous state', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state1' }, 'Action 1');
      manager.pushState({ data: 'state2' }, 'Action 2');
      const state = manager.undo();
      expect(state.data).toBe('state1');
    });

    it('should decrement currentIndex', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state1' }, 'Action 1');
      manager.pushState({ data: 'state2' }, 'Action 2');
      expect(manager.currentIndex).toBe(1);
      manager.undo();
      expect(manager.currentIndex).toBe(0);
    });

    it('should return null at beginning', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state1' }, 'Action 1');
      // Can't undo past the first state
      expect(manager.undo()).toBe(null);
    });

    it('should return null on empty history', () => {
      const manager = new HistoryManager();
      expect(manager.undo()).toBe(null);
    });

    it('should maintain redo stack', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state1' }, 'Action 1');
      manager.pushState({ data: 'state2' }, 'Action 2');
      manager.undo();
      expect(manager.canRedo()).toBe(true);
    });
  });

  describe('redo()', () => {
    it('should return next state', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state1' }, 'Action 1');
      manager.pushState({ data: 'state2' }, 'Action 2');
      manager.undo();
      const state = manager.redo();
      expect(state.data).toBe('state2');
    });

    it('should increment currentIndex', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state1' }, 'Action 1');
      manager.pushState({ data: 'state2' }, 'Action 2');
      manager.undo();
      expect(manager.currentIndex).toBe(0);
      manager.redo();
      expect(manager.currentIndex).toBe(1);
    });

    it('should return null at end', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state1' }, 'Action 1');
      manager.pushState({ data: 'state2' }, 'Action 2');
      expect(manager.redo()).toBe(null);
    });

    it('should return null on empty history', () => {
      const manager = new HistoryManager();
      expect(manager.redo()).toBe(null);
    });
  });

  describe('canUndo()', () => {
    it('should return true when history exists', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state1' }, 'Action 1');
      manager.pushState({ data: 'state2' }, 'Action 2');
      expect(manager.canUndo()).toBe(true);
    });

    it('should return false at beginning', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state1' }, 'Action 1');
      expect(manager.canUndo()).toBe(false);
    });

    it('should return false on empty history', () => {
      const manager = new HistoryManager();
      expect(manager.canUndo()).toBe(false);
    });
  });

  describe('canRedo()', () => {
    it('should return true when redo available', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state1' }, 'Action 1');
      manager.pushState({ data: 'state2' }, 'Action 2');
      manager.undo();
      expect(manager.canRedo()).toBe(true);
    });

    it('should return false at end', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state1' }, 'Action 1');
      expect(manager.canRedo()).toBe(false);
    });

    it('should return false on empty history', () => {
      const manager = new HistoryManager();
      expect(manager.canRedo()).toBe(false);
    });
  });

  describe('getCurrentState()', () => {
    it('should return current state', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state1' }, 'Action 1');
      manager.pushState({ data: 'state2' }, 'Action 2');
      expect(manager.getCurrentState().data).toBe('state2');
    });

    it('should return null on empty history', () => {
      const manager = new HistoryManager();
      expect(manager.getCurrentState()).toBe(null);
    });
  });

  describe('jumpTo()', () => {
    it('should jump to specific index', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state0' }, 'Action 0');
      manager.pushState({ data: 'state1' }, 'Action 1');
      manager.pushState({ data: 'state2' }, 'Action 2');
      const state = manager.jumpTo(0);
      expect(state.data).toBe('state0');
      expect(manager.currentIndex).toBe(0);
    });

    it('should return state at index', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state0' }, 'Action 0');
      manager.pushState({ data: 'state1' }, 'Action 1');
      const state = manager.jumpTo(1);
      expect(state.data).toBe('state1');
    });

    it('should return null for invalid index', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state0' }, 'Action 0');
      expect(manager.jumpTo(-1)).toBe(null);
      expect(manager.jumpTo(5)).toBe(null);
    });
  });

  describe('getTimeline()', () => {
    it('should return timeline with entries', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state0' }, 'Action 0');
      manager.pushState({ data: 'state1' }, 'Action 1');
      const timeline = manager.getTimeline();
      expect(timeline.length).toBe(2);
      expect(timeline[0].description).toBe('Action 0');
      expect(timeline[1].description).toBe('Action 1');
    });

    it('should mark current entry', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state0' }, 'Action 0');
      manager.pushState({ data: 'state1' }, 'Action 1');
      const timeline = manager.getTimeline();
      expect(timeline[0].isCurrent).toBe(false);
      expect(timeline[1].isCurrent).toBe(true);
    });

    it('should include timestamps', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state0' }, 'Action 0');
      const timeline = manager.getTimeline();
      expect(timeline[0].timestamp).toBeTypeOf('number');
    });
  });

  describe('clear()', () => {
    it('should clear all history', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state0' }, 'Action 0');
      manager.pushState({ data: 'state1' }, 'Action 1');
      manager.clear();
      expect(manager.history.length).toBe(0);
      expect(manager.currentIndex).toBe(-1);
    });
  });

  describe('size()', () => {
    it('should return current history size', () => {
      const manager = new HistoryManager();
      expect(manager.size()).toBe(0);
      manager.pushState({ data: 'state0' }, 'Action 0');
      expect(manager.size()).toBe(1);
      manager.pushState({ data: 'state1' }, 'Action 1');
      expect(manager.size()).toBe(2);
    });
  });

  describe('getCurrentDescription()', () => {
    it('should return current description', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state0' }, 'My Action');
      expect(manager.getCurrentDescription()).toBe('My Action');
    });

    it('should return empty string on empty history', () => {
      const manager = new HistoryManager();
      expect(manager.getCurrentDescription()).toBe('');
    });
  });

  describe('getUndoDescription()', () => {
    it('should return description of undo target', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state0' }, 'First');
      manager.pushState({ data: 'state1' }, 'Second');
      expect(manager.getUndoDescription()).toBe('First');
    });

    it('should return null when cannot undo', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state0' }, 'First');
      expect(manager.getUndoDescription()).toBe(null);
    });
  });

  describe('getRedoDescription()', () => {
    it('should return description of redo target', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state0' }, 'First');
      manager.pushState({ data: 'state1' }, 'Second');
      manager.undo();
      expect(manager.getRedoDescription()).toBe('Second');
    });

    it('should return null when cannot redo', () => {
      const manager = new HistoryManager();
      manager.pushState({ data: 'state0' }, 'First');
      expect(manager.getRedoDescription()).toBe(null);
    });
  });
});
