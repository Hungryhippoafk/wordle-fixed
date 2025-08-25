function escapeHtml(s) {
  return String(s)
    .replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
}

module.exports = function renderHighscores(rows) {
  const rowsHtml = rows.map((r, i) => `
    <tr>
      <td>${i+1}</td>
      <td>${escapeHtml(r.name)}</td>
      <td>${(r.time_ms/1000).toFixed(2)}s</td>
      <td>${r.attempts}</td>
      <td>${r.word_length}</td>
      <td>${r.unique_only ? "Ja" : "Nej"}</td>
      <td>${new Date(r.created_at).toLocaleString()}</td>
    </tr>
  `).join("");

  return `<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Highscores</title>
<link rel="stylesheet" href="/style.css"/>
</head>
<body>
<div class="wrap">
  <header class="nav">
    <a class="btn" href="/">Spela</a>
    <a class="btn" href="/about">Om</a>
    <a class="btn" href="/highscores">Highscores</a>
  </header>
  <h1>Highscores</h1>
  <p>Sorterad på snabbast tid.</p>
  <table class="table">
    <thead><tr><th>#</th><th>Namn</th><th>Tid</th><th>Gissningar</th><th>Längd</th><th>Unika</th><th>Datum</th></tr></thead>
    <tbody>${rowsHtml || `<tr><td colspan="7">Inga resultat ännu.</td></tr>`}</tbody>
  </table>
</div>
</body>
</html>`;
};
