# E2E Test Report

## Summary

| Environment | Result |
|------------|--------|
| Local (Chromium) | ✅ 20/20 pass |
| CI (Chromium) | ✅ Pass |
| CI (Firefox) | ❌ Fails |
| CI (WebKit) | ❌ Fails |

## Failing Tests (Firefox/WebKit in CI)

### 1. `should load without console errors`

**Error:** Console errors detected that aren't filtered out.

**Errors captured:**
```
- "Error" (generic)
- Font download failed: "Space Mono" from fonts.gstatic.com
- MIME type mismatch: GLTFLoader.js from unpkg.com blocked (text/plain instead of application/javascript)
```

**Root Cause:** External CDN resources fail to load in CI environment:
- Google Fonts may be blocked or timeout
- unpkg.com returns wrong MIME type for Three.js loader in Firefox/WebKit

### 2. `should render 3D canvas`

**Error:** `locator('canvas')` not found - element not visible.

**Root Cause:** The Three.js canvas fails to render because GLTFLoader.js is blocked. The app depends on this external resource to initialize the 3D scene.

## Why Tests Pass Locally

- Local environment has better network access to CDNs
- Chromium handles MIME type issues more leniently
- Cached resources may be available locally

## Recommended Fixes

### Option A: Update error filter (quick fix)
Expand the console error filter to ignore:
- Font download failures
- MIME type mismatches
- Generic "Error" strings (from failed resource loads)

### Option B: Run only Chromium in CI
Modify playwright.config.js to only test Chromium, which handles the CDN issues better.

### Option C: Self-host critical resources (long-term)
Download GLTFLoader.js and fonts locally to avoid CDN dependencies.

## Current Error Filter

```javascript
const criticalErrors = errors.filter(
  (e) => !e.includes('WebGL') && !e.includes('THREE')
);
```

## Proposed Error Filter

```javascript
const criticalErrors = errors.filter(
  (e) =>
    !e.includes('WebGL') &&
    !e.includes('THREE') &&
    !e.includes('downloadable font') &&
    !e.includes('MIME type') &&
    !e.includes('fonts.gstatic.com') &&
    e !== 'Error'
);
```
