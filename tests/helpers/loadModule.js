/**
 * Module Loader Helper
 *
 * Since the source modules define global functions without ES6 exports,
 * we use Node's VM module to load them into an isolated context.
 * This allows us to test global functions in isolation.
 */
import { readFileSync } from 'fs';
import vm from 'vm';
import path from 'path';

/**
 * Load a module file and return its global context
 *
 * @param {string} modulePath - Absolute path to the module file
 * @param {Object} preloadContext - Optional pre-existing global context (for dependencies)
 * @returns {Object} The context containing all globals defined by the module
 */
export function loadModule(modulePath, preloadContext = {}) {
  const code = readFileSync(modulePath, 'utf-8');

  // Create a context with console available for debugging
  // and any preloaded globals from dependencies
  const moduleExports = {};
  const context = vm.createContext({
    ...preloadContext,
    console,
    // Provide module and window stubs for compatibility
    module: { exports: moduleExports },
    window: {},
    // Math and JSON are needed for calculations
    Math,
    JSON,
    Date,
    Array,
    Object,
    String,
    Number,
    Boolean,
    parseInt,
    parseFloat,
    isNaN,
    Set
  });

  // Wrap the code to capture const/let declarations as global properties.
  // We use a technique that evaluates the code and then assigns top-level
  // const declarations to the globalThis object.
  const wrappedCode = `
    (function() {
      ${code}
      // Capture commonly defined constants and classes
      if (typeof DOOR_SPECS !== 'undefined') globalThis.DOOR_SPECS = DOOR_SPECS;
      if (typeof DRAWER_BOX !== 'undefined') globalThis.DRAWER_BOX = DRAWER_BOX;
      if (typeof HINGE_TYPES !== 'undefined') globalThis.HINGE_TYPES = HINGE_TYPES;
      if (typeof SLIDE_TYPES !== 'undefined') globalThis.SLIDE_TYPES = SLIDE_TYPES;
      if (typeof PULL_TYPES !== 'undefined') globalThis.PULL_TYPES = PULL_TYPES;
      if (typeof CONSTRUCTION_TYPES !== 'undefined') globalThis.CONSTRUCTION_TYPES = CONSTRUCTION_TYPES;
      if (typeof DIMENSION_CONSTRAINTS !== 'undefined') globalThis.DIMENSION_CONSTRAINTS = DIMENSION_CONSTRAINTS;
      if (typeof validateDimension !== 'undefined') globalThis.validateDimension = validateDimension;
      if (typeof validateCabinetDimensions !== 'undefined') globalThis.validateCabinetDimensions = validateCabinetDimensions;
      if (typeof validateDrawerConfiguration !== 'undefined') globalThis.validateDrawerConfiguration = validateDrawerConfiguration;
      if (typeof validateDoorDrawerConflict !== 'undefined') globalThis.validateDoorDrawerConflict = validateDoorDrawerConflict;
      if (typeof validateCabinet !== 'undefined') globalThis.validateCabinet = validateCabinet;
      if (typeof getValidationSummary !== 'undefined') globalThis.getValidationSummary = getValidationSummary;
      if (typeof findClosestStandard !== 'undefined') globalThis.findClosestStandard = findClosestStandard;
      if (typeof parseFraction !== 'undefined') globalThis.parseFraction = parseFraction;
      if (typeof decimalToFraction !== 'undefined') globalThis.decimalToFraction = decimalToFraction;
      if (typeof formatMeasurement !== 'undefined') globalThis.formatMeasurement = formatMeasurement;
      if (typeof CabinetComponent !== 'undefined') globalThis.CabinetComponent = CabinetComponent;
      if (typeof Drawer !== 'undefined') globalThis.Drawer = Drawer;
      if (typeof Door !== 'undefined') globalThis.Door = Door;
      if (typeof Cabinet !== 'undefined') globalThis.Cabinet = Cabinet;
      if (typeof HistoryManager !== 'undefined') globalThis.HistoryManager = HistoryManager;
      if (typeof MAX_HISTORY_SIZE !== 'undefined') globalThis.MAX_HISTORY_SIZE = MAX_HISTORY_SIZE;
    })();
  `;

  vm.runInContext(wrappedCode, context);

  // Also merge module.exports if used
  if (moduleExports && Object.keys(moduleExports).length > 0) {
    Object.assign(context, moduleExports);
  }

  return context;
}

/**
 * Get the absolute path to a module in site/modules/
 *
 * @param {string} moduleName - Name of the module file (e.g., 'measurements.js')
 * @returns {string} Absolute path to the module
 */
export function getModulePath(moduleName) {
  return path.resolve(process.cwd(), 'site', 'modules', moduleName);
}
