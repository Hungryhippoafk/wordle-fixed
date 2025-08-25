const express = require("express");
const router = express.Router();
const db = require("../db");
const renderHighscores = require("../views/highscores.html");

router.get("/highscores", (_req, res) => {
  db.all(
    `SELECT id, name, time_ms, attempts, word_length, unique_only, guesses, created_at
     FROM highscores ORDER BY time_ms ASC, id ASC LIMIT 100`,
    [],
    (err, rows) => {
      if (err) return res.status(500).send("<h1>Fel</h1><p>Kunde inte läsa highscore.</p>");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(renderHighscores(rows));
    }
  );
});

router.get("/about", (_req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="sv"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Om projektet</title>
<link rel="stylesheet" href="/style.css"/>
</head>
<body>
<div class="wrap">
  <header class="nav">
    <a class="btn" href="/">Spela</a>
    <a class="btn" href="/about">Om</a>
    <a class="btn" href="/highscores">Highscores</a>
  </header>
  <h1>Om projektet</h1>
  <p>Fullstack Wordle: Express (5080), React-GUI, SSR highscore i SQLite, slumpord via backend.</p>
</div>
</body></html>`);
});

router.get("/", (_req, res) => {
  res.sendFile(require("path").join(process.cwd(), "public", "index.html"));
});

module.exports = router;
