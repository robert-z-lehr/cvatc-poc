Community Voice at the Corner Proof-of-Concept
# CVatC POC (GitHub Pages)

Minimal proof-of-concept for Community Voice at the Corner:
- Anonymous feedback textbox
- On-device voice dictation (Web Speech API)
- Map + expandable community resources

## Deploy (GitHub Pages)
1. Create a repo (e.g., `cvatc-poc`)
2. Add files from this repo structure
3. GitHub → Settings → Pages
   - Source: Deploy from branch
   - Branch: `main` / root
4. Access the site here:
   [https://YOUR_USERNAME.github.io/cvatc-poc/ ](https://robert-z-lehr.github.io/cvatc-poc/)

## QR parameters (optional)
You can generate unique QR codes per intersection/site:

Example:
https://YOUR_USERNAME.github.io/cvatc-poc/?siteId=CO24&label=21st%20%26%20Guadalupe&lat=30.2849&lng=-97.7422

- `siteId`: short ID for the pole/intersection
- `label`: human-readable label
- `lat` / `lng`: coordinates

## Notes
- "Submit" is a demo button (no backend storage).
- For a real pilot, connect submission to:
  - Google Form + prefilled siteId, or
  - Firebase, or
  - a lightweight API endpoint.
