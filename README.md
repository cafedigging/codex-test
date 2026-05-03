# Goldfish Water Garden

A cozy browser-based web game prototype focused on gentle rescue, peaceful decorating, and calm fish watching.

## Features
- Three scenes:
  1. Alley Stream Rescue Scene
  2. Bring Goldfish Home Transition
  3. Aquarium Decoration / Water-Watching Scene
- Net-catching interaction for rescue.
- Decoration inventory (aquatic plants, pebbles, driftwood, lake ornament).
- Click-to-place and drag-to-place decorations.
- Fish happiness meter.
- Today's mission card with progressive goals.
- Calm idle mode (UI fades for relaxed viewing).
- Ambient animation: bubbles, shimmer, floating leaves, fish swim.
- Progress saved via `localStorage`.
- Responsive desktop/mobile layout.

## Local Run
Open `index.html` directly in a browser, or use a static server.

Example:
```bash
python3 -m http.server 8080
```
Then visit `http://localhost:8080`.

## Deploy on GitHub Pages
1. Push this project to a GitHub repository.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, set:
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or your default branch), folder `/ (root)`
4. Save and wait for deployment.
5. Open the published URL shown in the Pages settings.

## Deploy on Vercel (optional)
1. Import the repository into Vercel.
2. Framework preset: **Other**.
3. Build command: leave empty.
4. Output directory: leave empty (root static files).
5. Deploy.
