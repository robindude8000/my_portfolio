# Data Engineering Portfolio

A static portfolio with plain HTML, CSS, and JavaScript. No dependencies, build step, or npm. All editable profile content lives in `data/data.json`.

## Preview

Run from this directory:

```sh
python -m http.server 8000
```

Open http://localhost:8000. Opening `index.html` directly cannot reliably fetch JSON; the page shows the server command if loading fails.

## Edit your profile

Edit **only `data/data.json`** for routine updates. Use double quotes, avoid trailing commas, and save valid UTF-8 JSON.

| Field | Behavior |
| --- | --- |
| `name`, `title`, `summary` | Hero, name in navigation/footer, document title and metadata |
| `email` | Contact email; an empty string hides it |
| `links` | Contact links, in file order; use absolute HTTPS URLs |
| `pipeline` | Retained for compatibility; not displayed on the front page. Describe architecture within your projects instead. |
| `projects` | File order; `featured: false` hides an item; omitted `featured` means visible |
| `skills` | Groups and tags in file order |
| `experience` | Automatically sorted by `start`, newest first |
| `education` | File order; free-text `period` |

Empty or omitted arrays hide their section and corresponding navigation link. Contact hides when both email and valid links are absent. Two to six projects work well; longer lists also render. Invalid project URLs render as plain project cards rather than unsafe links.

For roles, use `YYYY-MM` dates and JSON `null` (without quotes) for a current role:

```json
{
  "role": "Data Engineer",
  "org": "Company name",
  "start": "2025-03",
  "end": null,
  "points": ["Describe your work and measurable outcomes."]
}
```

Dates display as `Mar 2025 — Present`; current roles receive a Current label. Experience order is determined by date, even if you reorder the array.

The profile and six work-history entries were updated from the supplied CV and subsequent corrections. Actual role titles and overlapping employment dates are retained; cloud platforms are labeled as familiarity rather than production expertise. Education has no date because none was supplied. The three featured projects link to the owner's actual repositories, and their descriptions were checked against README files and source code. Learning projects are distinct from professional experience; the Snowflake task is described as a definition, without claiming it is actively running. Existing GitHub and LinkedIn links were retained.

## GitHub Pages

Commit these five files at the root of the repository you intend to publish:

```text
index.html
assets/styles.css
assets/app.js
data/data.json
README.md
```

Select your publishing branch and `/ (root)` as the Pages source in the repository settings. No workflow or build step is needed. All local asset paths are relative and work under a repository subpath. Root `data.json` is a compatibility snapshot; the website reads only `data/data.json`. Make routine profile updates in `data/data.json`.

## Design and accessibility

The minimal design pairs Crimson Text headings with Google Sans body text and the ink/graphite/off-white palette. Dark mode uses the original ink background; light mode reverses the palette. Change the palette variables at the top of `assets/styles.css` to retheme. The header's Light/Dark toggle follows your system preference until you choose a mode, then remembers that choice in localStorage. If storage is unavailable, the toggle still works for the current page. The saved mode is applied before the first paint to avoid a theme flash.

Google Fonts is the only external resource; system fallbacks work offline. Reduced-motion preferences disable smooth scrolling and hover transitions. All dynamic content is inserted with `textContent` and DOM methods; URL protocols are restricted to HTTP/HTTPS. Keyboard focus is visible. Projects use rows that invert on hover and focus; skills use pill tags. Contact is compact and shares the page background. There is no pipeline strip on the front page.

The optional GitHub API enrichment is intentionally omitted to honor the Google-Fonts-only external-resource constraint. There are no analytics, external images, or JavaScript libraries.

## Metadata and performance

Description and Open Graph title/description update from JSON. Many social crawlers do not execute JavaScript and will see the generic HTML defaults. A personalized social preview for those crawlers would require changing the static metadata or a generation step; the site keeps the requested single-file editing workflow.

Fonts use `display=optional` to avoid late font swaps. The complete portfolio is rendered before it is revealed; the loading message is an overlay so it does not push content down. Run Lighthouse against the hosted site to verify the 95+ performance target and layout shift under actual network conditions; a score is not guaranteed without measurement.

Verified the current font pairing in headless Chrome: Crimson Text and Google Sans font files downloaded successfully; their styles are applied; both themes render without horizontal overflow at 360, 720, and 1440px. Earlier checks covered the theme toggle, matching contact background, removed pipeline, featured filtering, experience sorting/date formatting, current-role labels, empty-section/navigation hiding, safe text/URL handling, and load-error messages. Lighthouse was not run.
