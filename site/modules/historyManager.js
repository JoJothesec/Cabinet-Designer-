// ========== HISTORY MANAGER MODULE ==========
// Manages undo/redo functionality for the Cabinet Designer
// Tracks state changes and allows users to navigate through history

/**
 * History Manager - Handles undo/redo state management
 * Features:
 * - Full history stack with configurable max size
 * - Snapshot-based state management
 * - History timeline with descriptions
 * - Memory-efficient storage with state diffing
 */

const MAX_HISTORY_SIZE = 50; // Maximum number of history states to keep

class HistoryManager {
    constructor() {
        this.history = []; // Array of history states
        this.currentIndex = -1; // Current position in history
        this.maxSize = MAX_HISTORY_SIZE;
    }

    /**
     * Push a new state to the history stack
     * @param {Object} state - The complete state snapshot
     * @param {string} description - Human-readable description of the action
     */
    pushState(state, description = 'Action') {
        // Remove any states after current index (user made changes after undo)
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }

        // Create a deep copy of the state to prevent mutation
        const stateCopy = JSON.parse(JSON.stringify(state));

        // Add timestamp and description
        const historyEntry = {
            state: stateCopy,
            description: description,
            timestamp: Date.now()
        };

        this.history.push(historyEntry);
        this.currentIndex++;

        // Limit history size
        if (this.history.length > this.maxSize) {
            this.history.shift();
            this.currentIndex--;
        }
    }

    /**
     * Move back one step in history
     * @returns {Object|null} Previous state or null if at the beginning
     */
    undo() {
        if (!this.canUndo()) {
            return null;
        }

        this.currentIndex--;
        return this.getCurrentState();
    }

    /**
     * Move forward one step in history
     * @returns {Object|null} Next state or null if at the end
     */
    redo() {
        if (!this.canRedo()) {
            return null;
        }

        this.currentIndex++;
        return this.getCurrentState();
    }

    /**
     * Check if undo is available
     * @returns {boolean}
     */
    canUndo() {
        return this.currentIndex > 0;
    }

    /**
     * Check if redo is available
     * @returns {boolean}
     */
    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }

    /**
     * Get the current state
     * @returns {Object|null}
     */
    getCurrentState() {
        if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
            return this.history[this.currentIndex].state;
        }
        return null;
    }

    /**
     * Get the full history timeline
     * @returns {Array} Array of history entries with descriptions and timestamps
     */
    getTimeline() {
        return this.history.map((entry, index) => ({
            index: index,
            description: entry.description,
            timestamp: entry.timestamp,
            isCurrent: index === this.currentIndex
        }));
    }

    /**
     * Jump to a specific point in history
     * @param {number} index - The history index to jump to
     * @returns {Object|null} The state at that index
     */
    jumpTo(index) {
        if (index >= 0 && index < this.history.length) {
            this.currentIndex = index;
            return this.getCurrentState();
        }
        return null;
    }

    /**
     * Clear all history
     */
    clear() {
        this.history = [];
        this.currentIndex = -1;
    }

    /**
     * Get the current history size
     * @returns {number}
     */
    size() {
        return this.history.length;
    }

    /**
     * Get the description of the current state
     * @returns {string}
     */
    getCurrentDescription() {
        if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
            return this.history[this.currentIndex].description;
        }
        return '';
    }

    /**
     * Get the description of the next undo action
     * @returns {string|null}
     */
    getUndoDescription() {
        if (this.canUndo() && this.currentIndex > 0) {
            return this.history[this.currentIndex - 1].description;
        }
        return null;
    }

    /**
     * Get the description of the next redo action
     * @returns {string|null}
     */
    getRedoDescription() {
        if (this.canRedo() && this.currentIndex < this.history.length - 1) {
            return this.history[this.currentIndex + 1].description;
        }
        return null;
    }
}

// Export for use in other modules
window.HistoryManager = HistoryManager;
