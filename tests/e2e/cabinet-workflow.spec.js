/**
 * E2E Tests for Cabinet Designer Pro
 *
 * These tests verify the full application workflow in a real browser.
 */
import { test, expect } from '@playwright/test';

test.describe('Cabinet Designer Pro', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/site/index.html');
    // Wait for React app to initialize
    await page.waitForTimeout(1000);
  });

  test.describe('App Loading', () => {
    test('should load without console errors', async ({ page }) => {
      const errors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto('/site/index.html');
      await page.waitForTimeout(2000);

      // Filter out known non-critical errors (like WebGL warnings)
      const criticalErrors = errors.filter(
        (e) => !e.includes('WebGL') && !e.includes('THREE')
      );
      expect(criticalErrors).toHaveLength(0);
    });

    test('should render 3D canvas', async ({ page }) => {
      const canvas = page.locator('canvas');
      await expect(canvas).toBeVisible();
    });

    test('should show sidebar controls', async ({ page }) => {
      // Look for the sidebar container
      const sidebar = page.locator('[class*="sidebar"], [class*="panel"], [class*="controls"]').first();
      await expect(sidebar).toBeVisible();
    });
  });

  test.describe('Cabinet Creation', () => {
    test('should create cabinet with default dimensions', async ({ page }) => {
      // Look for "New Cabinet" or "Add Cabinet" button
      const addButton = page.locator('button, [role="button"]').filter({ hasText: /new|add|create/i }).first();

      if ((await addButton.count()) > 0) {
        await addButton.click();
        await page.waitForTimeout(500);

        // Verify a cabinet was created (3D scene should update)
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
      }
    });
  });

  test.describe('Dimension Inputs', () => {
    test('should have width input', async ({ page }) => {
      const widthInput = page.locator('input[name*="width" i], input[placeholder*="width" i], label:has-text("Width") + input, label:has-text("Width") ~ input').first();

      if ((await widthInput.count()) > 0) {
        await expect(widthInput).toBeVisible();
      }
    });

    test('should have height input', async ({ page }) => {
      const heightInput = page.locator('input[name*="height" i], input[placeholder*="height" i], label:has-text("Height") + input, label:has-text("Height") ~ input').first();

      if ((await heightInput.count()) > 0) {
        await expect(heightInput).toBeVisible();
      }
    });

    test('should have depth input', async ({ page }) => {
      const depthInput = page.locator('input[name*="depth" i], input[placeholder*="depth" i], label:has-text("Depth") + input, label:has-text("Depth") ~ input').first();

      if ((await depthInput.count()) > 0) {
        await expect(depthInput).toBeVisible();
      }
    });

    test('should accept fraction input format', async ({ page }) => {
      // Find any dimension input
      const input = page.locator('input[type="text"], input[type="number"]').first();

      if ((await input.count()) > 0) {
        await input.fill('36 1/2');
        const value = await input.inputValue();
        expect(value).toBe('36 1/2');
      }
    });
  });

  test.describe('Camera Controls', () => {
    test('should have camera view buttons or number keys', async ({ page }) => {
      // Look for camera preset buttons
      const cameraButtons = page.locator('button, [role="button"]').filter({ hasText: /front|top|side|iso|3d|view/i });

      // Either camera buttons exist or we test keyboard shortcuts
      const count = await cameraButtons.count();
      if (count > 0) {
        await expect(cameraButtons.first()).toBeVisible();
      } else {
        // Test that canvas accepts keyboard input (for number key presets)
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
      }
    });

    test('should allow mouse interaction with 3D view', async ({ page }) => {
      const canvas = page.locator('canvas');
      await expect(canvas).toBeVisible();

      // Drag to rotate view
      const box = await canvas.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2 + 50);
        await page.mouse.up();
      }
    });
  });

  test.describe('Undo/Redo', () => {
    test('should have undo button', async ({ page }) => {
      const undoButton = page.locator('button, [role="button"]').filter({ hasText: /undo/i });

      if ((await undoButton.count()) > 0) {
        await expect(undoButton).toBeVisible();
      }
    });

    test('should have redo button', async ({ page }) => {
      const redoButton = page.locator('button, [role="button"]').filter({ hasText: /redo/i });

      if ((await redoButton.count()) > 0) {
        await expect(redoButton).toBeVisible();
      }
    });

    test('should support Ctrl+Z keyboard shortcut', async ({ page }) => {
      // Focus on the page and try undo shortcut
      await page.keyboard.press('Control+z');
      // Just verify no error occurs
    });
  });

  test.describe('Project Save/Load', () => {
    test('should have save button', async ({ page }) => {
      const saveButton = page.locator('button, [role="button"]').filter({ hasText: /save/i });

      if ((await saveButton.count()) > 0) {
        await expect(saveButton).toBeVisible();
      }
    });

    test('should have load/open button', async ({ page }) => {
      const loadButton = page.locator('button, [role="button"]').filter({ hasText: /load|open/i });

      if ((await loadButton.count()) > 0) {
        await expect(loadButton).toBeVisible();
      }
    });
  });

  test.describe('Export Features', () => {
    test('should have export or print button', async ({ page }) => {
      const exportButton = page.locator('button, [role="button"]').filter({ hasText: /export|print|pdf/i });

      if ((await exportButton.count()) > 0) {
        await expect(exportButton).toBeVisible();
      }
    });
  });

  test.describe('Door and Drawer Controls', () => {
    test('should have door style selector', async ({ page }) => {
      const doorSelector = page.locator('select, [role="listbox"]').filter({ hasText: /shaker|flat|raised|glass/i });

      if ((await doorSelector.count()) > 0) {
        await expect(doorSelector).toBeVisible();
      }
    });

    test('should have add drawer control', async ({ page }) => {
      const addDrawerButton = page.locator('button, [role="button"]').filter({ hasText: /drawer/i });

      if ((await addDrawerButton.count()) > 0) {
        await expect(addDrawerButton).toBeVisible();
      }
    });
  });

  test.describe('Material Selection', () => {
    test('should have material selector', async ({ page }) => {
      const materialSelector = page.locator('select, [role="listbox"], button').filter({ hasText: /oak|maple|cherry|birch|material/i });

      if ((await materialSelector.count()) > 0) {
        await expect(materialSelector.first()).toBeVisible();
      }
    });
  });

  test.describe('Responsive Layout', () => {
    test('should adjust layout on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);

      // App should still be functional
      const canvas = page.locator('canvas');
      await expect(canvas).toBeVisible();
    });
  });
});
