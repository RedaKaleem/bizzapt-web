# Bizzapt — Everything connects

Bizzapt’s existing static website, evolved around business problems and connected capabilities. Plain HTML, CSS and JavaScript; no framework or dependency installation needed.

## Run locally

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://localhost:8000>. Use a web server rather than opening HTML files directly, because the shared scripts are JavaScript modules.

## Structure

- `index.html`: dark floating-symbol hero, capability ecosystem, challenge folders, Build/Grow/Scale journey, selected work, process, beliefs, partners and contact.
- `services.html`: stable existing route, now labelled **How we help**, with Launch, Grow, Optimize and Scale environments.
- `projects.html`, `about.html`, `team.html`: existing archive, company story and team.
- `styles.css`: original visual system and preserved component styles.
- `hero-field.css`: scattered solution symbols with independent drift, hover/focus details, capability links, a large lower-right Bizzapt mark, mobile composition and reduced-motion support.
- `connections.css`: scoped connected layouts, responsive alternatives and reduced-motion rules.
- `script.js`: shared navigation, tabs, form, project previews and dialogs.
- `connections-data.mjs`: capability paths, challenge names and old fragment aliases.
- `connections.js`: network rendering, floating-symbol interactions and motion controls, journey progress and enquiry preselection.
- `visual-direction.md`: element-by-element KEEP / REFINE / SIMPLIFY / REPLACE audit and the shared editorial visual system.

Old service fragments (`#branding`, `#data`, `#web-design`, `#web-development`) resolve to the new environments. New links use `#launch`, `#grow`, `#optimize` and `#scale`.

The Formspree endpoint is preserved. Enquiries now send an `accomplishment` field instead of `service`. Check any downstream integrations that depend on the old field name. Testing never sends a real enquiry.

Project descriptions, screenshots, links and research are retained. Unpublished discovery notes and measured outcomes are clearly marked. Replace those statements only with verified project evidence.

## Checks

```sh
node --test tests/connections.test.mjs
python3 tests/check_site.py
node --input-type=module --check < script.js
node --input-type=module --check < connections.js
git diff --check
```

These check capability paths, old links, keyboard-operated environment tabs, form success/failure, and static references across all pages. See `design-qa.md` for the browser-verification limitation and the manual checklist.

The site remains compatible with the existing static Vercel setup. Social metadata uses the supplied production origin, `https://bizzapt-web.vercel.app`; update it if the canonical domain changes.
