# Bizzapt: connected positioning

## Existing site audit

- Stack: five static HTML pages, a shared stylesheet and vanilla JavaScript; Google Fonts only. No build system or runtime dependencies.
- Identity: warm paper `#f4eee6`, ink `#211d1b`, plum `#60435b`, rose `#c5b2b2`, cyan `#8dd4d9`, gold `#bfa26a`. Playfair Display headlines, Manrope body, DM Mono labels. Preserve the logo assets, grain, editorial spacing and collage composition.
- Existing interactions: nine mutually exclusive flip tiles, expanding folders, keyboard-operable environment tabs, partner filters, project slideshow and live previews, native team/about dialogs, email copying, Formspree submission with error/success feedback, mobile navigation.
- Responsive problem: phone hero currently forces nine tiny cards into three columns and truncates their descriptions. Replace this with a readable two-column collage and full-width reveals.
- Old positioning: service folders, discipline tabs, service-based footer links, form's `service` field, startup-only hero, and service-focused project labels.
- Stylesheet has many historical overrides. Isolate new composition in `connections.css`, reusing the original typography, tokens, assets, navigation and legacy page components without another dependency or a wholesale stylesheet rewrite.

## Implementation

1. Preserve the hero collage; make its tiles react as connected groups and make the business-first promise explicit.
2. Add a capability network with pointer, keyboard and tap selection, visible related nodes and an equivalent readable path. Use a stacked mobile representation.
3. Recast folders as example business challenges and show each connected capability sequence.
4. Connect Build, Grow and Scale using a continuous progress path; follow with existing project material, a five-step process, beliefs and the enquiry form.
5. Keep `services.html` as the stable route, labelled “How we help”; recast its changing environments around Launch, Grow, Optimize and Scale. Preserve old fragment links as aliases.
6. Preserve project descriptions, images, links, research and team content. Identify unpublished discovery/outcome information explicitly; do not invent evidence or metrics.
7. Keep the existing Formspree endpoint. Ask what the visitor wants to accomplish, including “Not sure yet.” Validate without sending a real enquiry.
8. Verify syntax, internal references, semantic relationships, form contract, route aliases and reduced-motion behavior. Browser runtime reported no available browsers; record this limitation honestly.
