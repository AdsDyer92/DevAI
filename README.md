# Development Potential App

This is a starter Next.js codebase for a planning-led site screening tool.

## What is included
- App Router based Next.js frontend
- Shared assessment engine in `lib/assessment.ts`
- Mock site lookup in `lib/mock-lookup.ts`
- Starter API routes for assessment, lookup, and report output
- Basic database schema sketch with PostGIS tables

## Run locally
```bash
npm install
npm run dev
```

## Immediate next steps
1. Replace mock lookup with real geocoding and planning constraints data.
2. Wire the frontend to the API routes instead of local function calls.
3. Add authentication and saved project persistence.
4. Load planning comparables and committee voting data into Postgres/PostGIS.
