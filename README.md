# Thirsty Things

A Next.js app showing how much water it takes to produce everyday things.

The app is driven entirely by two inputs:

- **`data/things.json`**: a list of things, each with a `name`, `liters` (water consumption in liters) and `image` (a file name in the images folder).
- **`public/images/things/`**: one SVG per thing.

```json
[
  { "name": "Cup of coffee", "liters": 130, "image": "coffee.svg" }
]
```

To add a thing, drop its SVG into `public/images/things/` and add an entry to `data/things.json`. The build fails with a clear message if an entry is malformed, a name is duplicated, or its image is missing.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

Each thing gets its own page at `/things/<slug>`, where the slug comes from its name (e.g. `/things/cup-of-coffee`).
