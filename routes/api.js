const express = require("express");
const router = express.Router();
const db = require("../db");
const { pickRandomWord } = require("../services/words");

// GET /api/new-game
router.get("/new-game", (req, res) => {
  const len = Math.max(3, Math.min(10, parseInt(req.query.length || "5", 10)));
  const uniqueOnly = (String(req.query.unique || "true").toLowerCase() === "true");
  const word = pickRandomWord(len, uniqueOnly);
  if (!word) return res.status(400).json({ error: "Inga ord matchar valen." });

  res.json({ word, length: len, uniqueOnly, startedAt: Date.now() });
});

// POST /api/highscores
router.post("/highscores", (req, res) => {
  const { name, timeMs, attempts, wordLength, uniqueOnly, guesses } = req.body || {};
  if (!name || typeof timeMs !== "number" || typeof attempts !== "number" ||
      typeof wordLength !== "number" || typeof uniqueOnly !== "boolean" || !Array.isArray(guesses)) {
    return res.status(400).json({ error: "Ogiltig data." });
  }
  const stmt = db.prepare(`
    INSERT INTO highscores (name, time_ms, attempts, word_length, unique_only, guesses, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    String(name).slice(0, 40),
    Math.max(0, Math.floor(timeMs)),
    Math.max(1, Math.floor(attempts)),
    Math.max(1, Math.floor(wordLength)),
    uniqueOnly ? 1 : 0,
    JSON.stringify(guesses).slice(0, 20000),
    new Date().toISOString(),
    function (err) {
      if (err) return res.status(500).json({ error: "Kunde inte spara highscore." });
      res.json({ ok: true, id: this.lastID });
    }
  );
});

// (valfritt) GET /api/highscores
router.get("/highscores", (_req, res) => {
  db.all(
    `SELECT id, name, time_ms, attempts, word_length, unique_only, guesses, created_at
     FROM highscores ORDER BY time_ms ASC, id ASC LIMIT 100`,
    [],
    (err, rows) => err ? res.status(500).json({ error: "Fel vid hämtning." }) : res.json({ items: rows })
  );
});

module.exports = router;
