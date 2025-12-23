# Cabinet Designer - Questions & Technical Decisions

## 📋 Overview
This document tracks questions, technical decisions, and trade-offs discovered during development roadmap analysis. Questions are organized by category and priority, with context from comparing our implementation to professional cabinet software like Mozaik.

---

## 🏗️ Architecture & Technical Decisions

### Priority: HIGH

#### Q1: Build System Migration
**Question:** Should we migrate from Babel Standalone to a proper build system (Vite/Webpack)?

**Context:**
- Currently using Babel Standalone for in-browser JSX compilation
- Works but adds ~1MB to page load
- No optimization or tree-shaking
- Development-only solution per React docs

**Trade-offs:**
- ✅ **Pros of Migration:**
  - Faster load times (pre-compiled code)
  - Better performance (optimization, minification)
  - Enable TypeScript
  - Standard development workflow
  - Production-ready deployment

- ❌ **Cons of Migration:**
  - Requires build step (no longer "just open HTML")
  - Need Node.js for development
  - More complex setup for beginners
  - Build tool learning curve

**Options:**
1. **Keep Babel Standalone** - Simple but not production-ready
2. **Vite** - Fast, modern, great DX (RECOMMENDED)
3. **Create React App** - Stable but heavier
4. **Webpack** - Powerful but complex configuration

**Decision Needed By:** Before adding more features (Month 2)

**Related Questions:** Q2, Q8

---

#### Q2: TypeScript Adoption?
**Question:** Should we convert the codebase to TypeScript?

**Context:**
- Current JavaScript code is well-documented but not type-safe
- Growing codebase will benefit from type checking
- Many modern tools expect TypeScript

**Trade-offs:**
- ✅ **Pros:**
  - Catch errors at compile time
  - Better IDE autocomplete
  - Self-documenting code (types as docs)
  - Easier refactoring
  - Industry standard

- ❌ **Cons:**
  - Learning curve for contributors
  - Migration effort
  - Slightly more verbose
  - Build step required

**Options:**
1. Stay with JavaScript
2. Gradual migration (.js → .ts file by file)
3. Full rewrite in TypeScript

**Recommendation:** Gradual migration, starting with new features

**Decision Needed By:** Month 3

---

#### Q3: State Management Strategy
**Question:** Do we need a dedicated state management library (Redux, Zustand, MobX)?

**Context:**
- Currently using React useState/useEffect
- Cabinet data, project settings, UI state growing complex
- Undo/redo functionality will need state history

**Trade-offs:**
- ✅ **Pros of State Library:**
  - Centralized state management
  - Better debugging (Redux DevTools)
  - Easier undo/redo implementation
  - Predictable state updates
  - Better for team collaboration

- ❌ **Cons:**
  - Added complexity
  - Learning curve
  - More boilerplate code
  - May be overkill for current size

**Options:**
1. **Keep useState** - Simple, works for now
2. **Context API** - Built-in, good for medium apps
3. **Zustand** - Lightweight, simple (RECOMMENDED)
4. **Redux Toolkit** - Powerful, industry standard
5. **Jotai/Recoil** - Atomic state management

**Recommendation:** Switch to Zustand when implementing undo/redo (Month 3-4)

**Decision Needed By:** Month 3

---

### Priority: MEDIUM

#### Q4: 3D Rendering Library
**Question:** Should we stick with Three.js or explore alternatives?

**Context:**
- Three.js is working well for basic geometry
- May need more advanced features later (ray tracing, better materials)
- Three.js is well-established but can be complex

**Alternatives:**
1. **Keep Three.js** - Most popular, huge community (RECOMMENDED)
2. **React Three Fiber** - React wrapper for Three.js, better integration
3. **Babylon.js** - More features out-of-box, better for complex scenes
4. **PlayCanvas** - WebGL engine, good performance

**Related Questions:** Q14 (Photo-realistic rendering)

**Decision Needed By:** Month 4 (before kitchen layout feature)

---

#### Q5: Data Persistence Strategy
**Question:** How should we handle data persistence long-term?

**Current:** localStorage only (browser-based, no sync)

**Options:**
1. **localStorage only** - Simple, privacy-friendly, offline-first
2. **IndexedDB** - More storage space, structured data
3. **Cloud storage (optional)** - User accounts, sync, backup
4. **Hybrid** - localStorage default + optional cloud sync
5. **File-based** - Export/import project files only

**Trade-offs:**
- **localStorage:** Simple but limited (5-10MB), no sync
- **IndexedDB:** More space, complex API
- **Cloud:** Best UX but needs backend, privacy concerns, costs
- **Hybrid:** Best of both but most complex

**Recommendation:** 
- Short-term: Keep localStorage, add IndexedDB for large projects
- Long-term: Add optional cloud sync (Month 6+)

**Decision Needed By:** Month 3
- [ ] Should we support screen readers?

---

## 📋 Project Management


### Documentation
- [ ] What level of code documentation do we need (JSDoc, inline comments)?
- [ ] Should we create user documentation or tutorials?
- [ ] Do we need API documentation if we expose the code as a library?
- [ ] How do we keep README files up to date?

### Collaboration
- [ ] Who are the target contributors?
- [ ] Should we create contribution guidelines?
- [ ] How do we handle feature requests from users?

---

## 🎨 Design & User Experience Questions

### Priority: HIGH

#### Q9: Target Audience Focus
**Question:** Should we focus on professionals or hobbyists first?

**Context:**
- Professionals need advanced features (CNC, optimization)
- Hobbyists need simplicity and tutorials
- Different features, UI complexity, pricing models

**Current Design:** Somewhere in between

**Options:**
1. **Professional focus** - Rich features, steeper learning curve
2. **Hobbyist focus** - Simple, guided, lots of tutorials
3. **Two modes** - Simple mode + Advanced mode
4. **Progressive disclosure** - Start simple, reveal complexity

**Questions to Answer:**
- Who is our primary user?
- What problems are we solving?
- How do they measure success?
- What's their technical skill level?

**Recommendation:** Progressive disclosure - start simple, grow with user

**Decision Needed By:** Month 1 (affects all feature decisions)

---

#### Q10: Measurement Units
**Question:** Should we support metric (mm/cm) in addition to imperial (inches)?

**Context:**
- Currently imperial only (inches, fractions)
- International users may prefer metric
- Cabinet standards vary by region

**Trade-offs:**
- ✅ **Pros of Adding Metric:**
  - Broader user base
  - International markets
  - Scientific precision

- ❌ **Cons:**
  - Conversion complexity
  - Testing overhead
  - UI space for toggle
  - Two sets of standards

**Options:**
1. **Imperial only** - Keep current, simpler
2. **Metric only** - Alienates US market
3. **User preference toggle** - Best UX, more complex
4. **Auto-detect by location** - Smart but may be wrong

**Recommendation:** Add metric support with user toggle (Month 4-5)

**Decision Needed By:** Month 4

---

#### Q11: Undo/Redo Implementation
**Question:** What should be the scope of undo/redo functionality?

**Options:**
1. **No undo** - Rely on save points
2. **Simple undo** - Last action only
3. **History stack** - Unlimited undo/redo
4. **Granular history** - Timeline with previews

**Questions:**
- How many levels of undo?
- What actions are undoable?
- How to handle 3D view changes?
- Should project loads be undoable?

**Recommendation:** History stack with 50 action limit (Month 3-4)

---

## 🔧 Feature Implementation Questions

### Priority: HIGH

#### Q12: Kitchen Layout Designer Architecture
**Question:** How should the kitchen layout system work?

**Approach Options:**
1. **Canvas-based** - Draw cabinets on 2D canvas
2. **Grid-based** - Snap to grid system
3. **SVG-based** - Scalable, DOM-based
4. **3D placement** - Place cabinets in 3D space

**Key Design Questions:**
- How do users define room dimensions?
- How do they place cabinets (drag-drop, click-position)?
- How do we handle walls, corners, obstacles?
- How do we show measurements and spacing?
- Integration with existing 3D view?

**Recommendation:** 
- Top-down 2D grid view for layout
- Click or drag to place cabinets
- 3D view updates in real-time
- Snap-to-wall and snap-to-adjacent features

**Decision Needed By:** Month 3 (start of kitchen layout work)

---

#### Q13: Cut Optimization Algorithm
**Question:** What level of optimization should we implement?

**Context:**
- Simple nesting is complex algorithmically
- Perfect optimization is NP-hard problem
- Trade-off between accuracy and performance

**Options:**
1. **No optimization** - List parts, user arranges manually
2. **First-fit** - Simple, fast, not optimal
3. **Best-fit decreasing** - Better results, still fast
4. **Genetic algorithm** - Near-optimal, slower
5. **Third-party library** - Best results, dependency

**Questions:**
- What percentage waste is acceptable?
- How long can optimization take?
- Should user see optimization process?
- Can they manually adjust results?

**Recommendation:** Best-fit decreasing initially, GA for advanced users

**Decision Needed By:** Month 5

---

#### Q14: Hardware Catalog Integration
**Question:** Should we integrate with real hardware supplier catalogs?

**Context:**
- Currently generic hardware types
- Real products have specific dimensions, weights, costs
- Supplier APIs may or may not exist

**Options:**
1. **Generic only** - Keep current system
2. **Manual catalog** - We maintain product database
3. **Supplier API** - Real-time pricing/availability
4. **Import from CSV** - Users import their suppliers

**Trade-offs:**
- Generic: Simple but not realistic
- Manual: Work to maintain, outdated quickly
- API: Best but limited supplier support
- CSV Import: User work but most flexible

**Recommendation:** Manual catalog initially, CSV import (Month 7-8)

**Decision Needed By:** Month 6

---

#### Q15: Wood Grain Direction
**Question:** How should we handle grain direction in cut optimization?

**Context:**
- Grain direction matters for aesthetics and strength
- Affects how pieces can be nested on sheets
- Complicates optimization significantly

**Questions:**
- Which parts require specific grain direction?
- How to visualize grain in 3D?
- How to indicate grain on cut lists?
- Impact on optimization algorithms?

**Recommendation:** Phase 1 - ignore, Phase 2 - add as constraint

**Decision Needed By:** Month 5 (during optimization work)

---

## 📱 Platform & Deployment

### Priority: HIGH

#### Q16: Hosting & Deployment Strategy
**Question:** How should the application be deployed?

**Current:** Local files, user hosts themselves

**Options:**
1. **GitHub Pages** - Free, static hosting
2. **Netlify/Vercel** - Free tier, CI/CD, custom domains
3. **Self-hosted** - User manages everything
4. **Multiple options** - Offer hosted + self-hosted

**Considerations:**
- Where to store backend (if needed)?
- Custom domain?
- SSL certificate?
- CDN for performance?

**Recommendation:** Netlify/Vercel for hosted version + downloadable version

**Decision Needed By:** Month 2 (when ready for public)

---

#### Q17: Browser Support
**Question:** Which browsers should we officially support?

**Current:** Modern browsers with ES6+

**Options:**
1. **Modern only** - Chrome/Edge/Firefox/Safari latest 2 versions
2. **Wide support** - Include IE11, older browsers
3. **Progressive enhancement** - Basic functionality everywhere, enhanced for modern

**Minimum Requirements:**
- ES6 modules
- WebGL (for 3D)
- localStorage/IndexedDB
- Canvas API

**Recommendation:** Modern browsers only (90%+ coverage)

**Decision Needed By:** Month 1

---

## 🎓 Cabinet Making Industry Questions

### Priority: HIGH

#### Q18: Standard Cabinet Dimensions
**Question:** What standard dimensions should we support?

**Research Needed:**
- Common width increments (3", 6"?)
- Standard heights (30", 34.5", 84", 96"?)
- Depth standards (12", 24"?)
- Regional variations (US vs Europe vs Asia)
- IKEA vs custom cabinet standards

**Action Items:**
- Interview cabinet makers about common sizes
- Research industry standards (KCMA, AWI)
- Document standard configurations

**Decision Needed By:** Month 2

---

#### Q19: Cabinet Calculation Accuracy
**Question:** How accurate do our calculations need to be?

**Current Approach:**
- Simplified calculations
- Some edge cases not handled
- No material wastage factors

**Questions to Research:**
- Industry standard calculation methods?
- How do professionals calculate material?
- What accuracy is "good enough"?
- Validation against real projects?

**Next Steps:**
- Interview cabinet makers
- Compare with industry software
- Test with real projects

**Decision Needed By:** Month 2

---

#### Q20: Face Frame Construction Standards
**Question:** What are the standard practices for face frame cabinets?

**Research Topics:**
- Rail and stile widths
- Reveal dimensions
- Inset vs overlay standards
- Corner cabinet face frames
- Door hinge placement on frames

**Questions:**
- How do different shops approach face frames?
- Regional preferences?
- Cost implications?

**Decision Needed By:** Month 6

---

## 💰 Business & Licensing

### Priority: MEDIUM

#### Q21: Monetization Strategy
**Question:** Should this remain 100% free and open-source, or consider monetization?

**Context:**
- Substantial development effort
- Hosting costs for cloud features
- Sustainability considerations

**Options:**
1. **Free & Open Source** - Community-driven, donations
2. **Freemium** - Basic free, advanced features paid
3. **Pro Version** - Desktop app with more features
4. **SaaS** - Subscription for cloud features
5. **Marketplace** - Sell templates, plugins
6. **Sponsorships** - Company sponsors

**Questions:**
- Target commercial or personal use?
- Competition with free alternatives?
- Ethical considerations?
- Community impact?

**Recommendation:** Keep free/open-source, optional donations

**Decision Needed By:** Month 6

---

#### Q22: Commercial Use License
**Question:** What license should we use?

**Options:**
1. **MIT** - Very permissive, anyone can use/modify/sell
2. **GPL v3** - Open source, modifications must be open
3. **AGPL** - Like GPL but covers SaaS usage
4. **Apache 2.0** - Permissive with patent grant
5. **Dual License** - Open source + commercial

**Recommendation:** MIT for maximum adoption

**Decision Needed By:** Month 1 (before open-sourcing)

---

## 🔬 Technical Research Needed

### High Priority Research
- [ ] **Three.js Performance:** Benchmark with 50+ cabinets in a kitchen scene
- [ ] **Cut Optimization:** Survey available algorithms and libraries
- [ ] **CNC Integration:** Research common G-code formats and requirements
- [ ] **Material Calculations:** Validate accuracy with real projects
- [ ] **Face Frame Dimensions:** Document industry standards

### Medium Priority Research
- [ ] **Rendering Engines:** Compare Three.js vs alternatives for photo-realism
- [ ] **State Management:** Prototype undo/redo with different libraries
- [ ] **Mobile Performance:** Test on tablets and phones
- [ ] **Accessibility:** WCAG audit and improvements needed

### Low Priority Research
- [ ] **AI Integration:** Explore design suggestion possibilities
- [ ] **AR/VR:** Feasibility of cabinet visualization in AR
- [ ] **Voice Control:** Accessibility via voice commands

---

## 📝 Resolved Questions & Decisions

### Decision: Modular Code Structure ✅
**Date:** December 2025  
**Status:** Implemented  
**Decision:** Split monolithic scripts.js into 7 modular files  
**Outcome:** Successful, greatly improved code organization and maintainability

---

### Decision: Fraction Support ✅
**Date:** December 2025  
**Status:** Implemented  
**Decision:** Support fractional inch input (1/4", 3/8", etc.)  
**Outcome:** Essential for cabinet makers, working well

---

### Decision: localStorage for Projects ✅
**Date:** December 2025  
**Status:** Implemented  
**Decision:** Use browser localStorage for project storage  
**Outcome:** Simple, works well, may need cloud option later

---

## 🤔 Open-Ended Questions for Discussion

### User Experience
- What's the ideal workflow for a first-time user?
- How many clicks to create a basic cabinet?
- What information should be required vs optional?
- How do we balance simplicity with powerful features?

### Feature Prioritization
- Which features would convert casual users to advocates?
- What's the minimum viable feature set for a v1.0 release?
- Which features can generate the most user excitement?

### Community Building
- How do we attract contributors?
- What makes a good first issue for contributors?
- How to build a community around the project?
- Should we have a Discord/forum?

---

## 📊 Decision Priority Matrix

| Priority | Timeline | Impact | Complexity |
|----------|----------|--------|------------|
| **HIGH** | Immediate | Major | Any |
| **MEDIUM** | 1-3 months | Significant | Medium-High |
| **LOW** | 3+ months | Minor | Any |

---

## 🔄 Review Schedule

This document should be reviewed:
- **Weekly:** During active development sprints
- **Monthly:** Update priorities and add new questions
- **Quarterly:** Major architectural decisions
- **As needed:** When blocked on a decision

---

## 📝 Notes

- Use checkboxes `- [ ]` for unresolved questions
- Mark resolved items with `- [x]` or move to Resolved section
- Add dates and context to resolved questions
- Link to relevant documentation or commits when available
- Review and update this document regularly during team meetings

---

*Last Updated: December 20, 2025*
*Version: 1.0 - Comprehensive Update with roadmap analysis*

