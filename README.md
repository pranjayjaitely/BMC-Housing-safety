# BMC Building Safety (Seva Innovation Challenge 2026)

Static site. Real data: BMC C1 list dated 30 Apr 2026 (141 private buildings) in `data/c1.psv`. BMC does not publish per-building C2A/C2B/C3 lists; add rows to `data/graded.psv` when obtained. Demo samples are labelled SAMPLE.

## Project files
- `index.html` — website interface and map functionality
- `data/c1.psv` — published BMC C1 building list
- `data/graded.psv` — placeholder for verified C2A/C2B/C3 records
- `scripts/geocode.mjs` — optional geocoding utility (requires Node.js)

## Deployment
Import this repository into Vercel. Choose **Other** as the framework preset and leave the build command empty. Deploy the static site.

Note: building coordinates may be approximate unless geocoded. Absence from the published C1 list is not a safety certificate. This prototype is not an official BMC service.
