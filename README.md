# Pokemon Explorer

A Vite + React app for searching Pokemon with PokeAPI and saving favorites with Supabase.

## Features

- Search Pokemon by name or national dex ID
- View official artwork, type badges, height, weight, experience, and core stats
- Save favorite Pokemon to a Supabase `favorites` table
- Manage saved favorites with loading, empty, and error states
- Responsive UI for desktop and mobile

## Tech Stack

- React
- React Router
- Vite
- Supabase
- PokeAPI

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

## Supabase Table

The app expects a `favorites` table with these fields:

- `id`
- `name`
- `image_url`
- `types`
