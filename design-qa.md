# Connected Bizzapt — validation

## Verified

- All five HTML routes and the three new connected-system assets return HTTP 200 from the running local server. Module files are served as JavaScript.
- Shared and connected scripts pass JavaScript syntax checks. Both stylesheets parse successfully with the locally available CSS parser.
- Six Node tests pass: orbit pause/visibility controls, capability relationships, bookmarked service aliases, invalid/successful form submission, server/network failure handling, and environment-tab initialization/keyboard/hash navigation. Transport is stubbed; no real enquiry was sent.
- Dependency-free Python checks pass for local files, fragment links, duplicate IDs, image alternatives, ARIA references, ten capability nodes, ten orbital capability marks, the four environment panels and the existing Formspree contract.
- Existing project entries, image slideshow, research links, partner directory, team profiles and enquiry destination are retained.
- No invented project metrics, clients, testimonials or team members. Discovery and outcome gaps are explicitly marked.
- Patch whitespace checks pass.

## Implemented, requiring rendered browser verification

- Visual refinement follows the audit in `visual-direction.md`: shared neutral palette, restrained plum/teal/gold accents, small radii, thin rules, serif narrative headlines and sans-serif module titles.
- Hero tiles have been removed. The dark orbital hero places the Bizzapt logo at the center of two rotating capability rings behind the exact requested copy. Symbols stack above names and counter-rotate to stay upright.
- Desktop ecosystem paths now use orthogonal connectors. Diagrams, progression and selection remain purposeful motion; floating artwork, tilted panels and decorative stickers are removed from active components.
- Challenge disclosures form one indexed surface. The launch environment reuses brand assets in a connected direction/identity/language/experience diagram. Its mobile layout follows the same DOM sequence vertically.
- Project, About, team and dialog surfaces use the same shape and motion rules. Team portraits and content are preserved in rectangular frames with persistent action labels.
- Hero uses smaller orbital geometry and reflowed foreground text on phones. Its background is decorative; all ten capabilities remain available in the accessible ecosystem below. Motion has a pause control, stops off-screen, and is disabled for reduced-motion preferences.
- Ecosystem supports mouse, keyboard focus and tap. Desktop SVG paths measure actual node positions; phones use selectable nodes and a text sequence.
- Native challenge folders and belief disclosures work with touch and keyboard.
- Build/Grow/Scale uses one horizontal path on larger screens and one vertical path on phones. Scroll listeners are passive, frame-limited and only update when the journey is near the viewport.
- Environment tabs support arrow keys, Home/End, selected state and a single tab stop. Without JavaScript, all environments are visible.
- Shared reduced-motion styles disable animation, preserve visible connections and stop automatic slideshow motion. Direct Next-image activation remains available.
- Project live iframes load only on interaction; no page-load requests to all project websites.

## Browser limitation

The browser runtime reported `No browser is available`; its discovery list was empty. Consequently screenshots, actual layout/overflow measurements, rendered contrast, focus behavior and full browser interactions were not verified. Do not treat source checks as visual approval.

When a browser is available, inspect 1440px, 1024px, 768px, 390px and 320px widths. Check orbit pause/resume and every challenge disclosure, all ten network selections, all four worlds, menu Escape behavior, project slideshow keyboard/tap controls, dialogs, form validation and reduced-motion mode. Verify no horizontal overflow and that the form remains usable with longer messages.

## Content follow-up

Published case-study discovery findings and measured outcomes were not available in the repository. The archive provides explicit placeholders for that evidence. The form field changes from `service` to `accomplishment`; any external form integrations keyed to `service` should be updated.


## Current hero reference comparison — pending

- Source visual truth: screenshot attached to the latest user message; 2510 × 1436 original pixels (2048 × 1172 displayed). Dark scattered composition, left text, large Bizzapt mark at lower right.
- Implementation screenshot: unavailable. Browser discovery returned an empty list.
- Viewport / pixel density: not captured; no normalization or rendered comparison was possible.
- States requiring capture: desktop resting/hover/focus, mobile tap, pause/resume and reduced motion.
- Full-view and focused evidence: missing implementation capture. No visual fidelity pass is claimed for typography, spacing, colors, assets or copy placement.
- Code changes: removed rings and counter-rotation; reused supplied logo and existing capability symbols; added bounded independent movement, hover/focus descriptions, Escape dismissal, and selection of matching ecosystem capability.
- Validation: seven Node checks plus static HTML/ARIA/local-reference and CSS/JavaScript parsing checks. These are not a substitute for browser interaction or visual testing.
- Comparison history: first reference-based comparison blocked before screenshot capture. No rendered findings or successful comparison iterations are claimed.
- Follow-up: capture desktop at the reference aspect ratio and mobile at 390px; compare with the supplied reference, test interaction states, and fix observed differences.

final result: blocked


### Bare-symbol hero refinement
Removed all capability badge backgrounds and shape wrappers. Replaced short CSS oscillations with continuous measured movement. The entire symbol-and-label footprint is excluded from the Bizzapt image bounds with 42px clearance. Symbols fade to 12% behind the copy and use 40–58% opacity elsewhere; hover and focus restore full opacity. Mobile movement stays above the copy. Pause, reduced motion, page visibility, and offscreen controls remain supported.

Validation: 9 Node tests pass, including five simulated minutes of desktop movement with no brand collision and bounded mobile movement; local route/ARIA/form checks pass. Browser discovery still returns no available browsers. Rendered appearance and real-browser interaction remain unverified; visual QA remains blocked.


### Expanded technology and business service field
The hero now contains 18 symbols, adding Mobile apps, Cloud systems, CRM & sales, E-commerce, Digital marketing, Business consulting, Business operations, and Business analytics. Each has a unique accessible tooltip and selects its corresponding parent capability in the ecosystem. Mobile spacing accommodates the expanded field above the copy. Nine Node tests and static route, anchor, accessible-reference, and capability-target checks pass. Rendered visual verification remains pending.


### Raised hero and translucent navigation
Raised hero copy 80px on desktop, 70px on tablet and 40px on mobile. Navigation now uses blurred translucent fills and changes text, logo, and fill between light and dark states according to the section at its lower edge. The reference site's fetched CSS confirms its `is-scrolled` translucent treatment and `is-dark` theme switch. Mobile menus retain a readable solid surface. Syntax, static integration and all nine existing tests pass; rendered browser verification remains pending.


### Simplified ecosystem
Replaced the interactive node map and changing connection paths with three readable service groups: Find your direction, Build what you need, and Make work easier. Native expandable service descriptions preserve all ten capability targets for the hero icons. A short website/enquiry/CRM/follow-up example explains the connection in practical terms. All nine existing tests and static checks pass. Browser visual verification remains pending.


### Typography and simpler homepage structure
Applied Space Grotesk headings and Manrope body text across all five pages, with sans-serif fallbacks and upright emphasis. Removed the overlapping homepage What we solve section; Our capabilities now links to the renamed Our solutions page. Updated navigation, footer labels and page metadata while preserving the existing services.html route and challenge anchors. Static checks and nine Node tests pass; rendered typography and layout remain unverified.


### How we work placement and layout
Moved How we work directly after Our capabilities. Replaced its side-by-side introduction and stacked list with a charcoal section, full-width introduction and five-step horizontal timeline. Below 1100px it becomes a vertical timeline. Space Grotesk and Manrope remain in use. Static checks, section ordering and CSS parsing pass. Rendered visual verification remains pending.


### Sitewide spacing refinement
Added shared spacing.css last in the cascade on all five routes. Increased section spacing to 100–160px on desktop and 80px on mobile, widened outer margins with a 1360px content measure, separated headings from content, and added breathing room inside capability lists, process steps, blog previews, forms, solutions and inner-page sections. Retained compact mobile hero spacing and constant navbar logo dimensions. Static route/reference checks, CSS parsing and diff whitespace checks pass. Rendered verification remains pending.


### Eight connected solutions
Added the approved eight-piece composition to Our solutions, between the introduction and challenge tabs. Includes AI Automation, Custom Software, Websites, Branding, Business Systems, Internal Dashboards, Mobile Apps and Digital Presence. Native buttons select illustrative connections and update the accessible example panel. Four columns become two on mobile, with matching interlock geometry at each breakpoint. Eleven Node tests pass, including every selection and relationship; route/ARIA and CSS checks pass. Browser visual verification remains pending.


### Projects page refresh and preview loading
Removed compounded narrow container widths and large intro whitespace. Added a consistent two-column gallery, readable project links, compact metadata and calmer research/closing sections. Live iframes now load 300px before entering view; fixed legacy display:none!important and removed the false 1.8-second ready timer. Slower previews retain a direct-open hint; the first local slideshow image loads eagerly. All eleven existing tests, static route checks and CSS parsing pass. External embed availability and rendered layout remain unverified.
