const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(path.join(process.cwd(), "scores.db"));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS highscores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      time_ms INTEGER NOT NULL,
      attempts INTEGER NOT NULL,
      word_length INTEGER NOT NULL,
      unique_only INTEGER NOT NULL,
      guesses TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
});

module.exports = db;
