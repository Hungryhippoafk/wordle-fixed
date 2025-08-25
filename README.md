# Wordle Game (Fullstack, Godkänt-nivå)

## Kör lokalt
```bash
npm install
npm start
# besök http://localhost:5080
```

## Struktur
- `server.js` – startar Express och kopplar routes
- `db/` – SQLite-init
- `routes/` – API och sidor (SSR + statisk)
- `services/` – ordlogik
- `views/` – SSR-mallar
- `public/` – klient (React via CDN)

## Obs
Detta är en enkel demo för G-nivå. VG-moment kan läggas till senare (server-side feedback, filtrering, tester, TS).
# wordle-fixed
