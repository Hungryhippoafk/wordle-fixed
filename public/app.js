const { useState } = React;

function computeFeedback(guess, target) {
  const n = target.length;
  const res = Array(n).fill("incorrect");
  const tArr = target.split(""), gArr = guess.split("");
  const leftover = {};
  for (let i = 0; i < n; i++) {
    if (gArr[i] === tArr[i]) res[i] = "correct";
    else leftover[tArr[i]] = (leftover[tArr[i]] || 0) + 1;
  }
  for (let i = 0; i < n; i++) {
    if (res[i] !== "correct" && leftover[gArr[i]] > 0) {
      res[i] = "misplaced"; leftover[gArr[i]]--;
    }
  }
  return res;
}

function Tiles({ word, feedback }) {
  return (
    <div className="row">
      {word.split("").map((ch,i)=><div key={i} className={"tile "+((feedback && feedback[i])||"")}>{ch}</div>)}
    </div>
  );
}

function App(){
  const [length, setLength] = useState(5);
  const [uniqueOnly, setUniqueOnly] = useState(true);
  const [secret, setSecret] = useState("");
  const [startedAt, setStartedAt] = useState(null);
  const [guess, setGuess] = useState("");
  const [history, setHistory] = useState([]);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  async function startGame(){
    setHistory([]); setFinished(false); setGuess(""); setError("");
    const res = await fetch(`/api/new-game?length=${length}&unique=${uniqueOnly}`);
    const data = await res.json();
    if (!res.ok) return setError(data.error||"Kunde inte starta spelet.");
    setSecret(data.word); setStartedAt(data.startedAt);
  }

  function submitGuess(e){
    e.preventDefault();
    if (!secret) return setError("Starta ett spel först.");
    const clean = guess.trim().toLowerCase();
    if (clean.length !== secret.length) return setError("Fel längd.");
    setError("");
    const fb = computeFeedback(clean, secret);
    const h = [...history, { word: clean, feedback: fb }];
    setHistory(h); setGuess("");
    if (clean === secret) setFinished(true);
  }

  async function submitScore(){
    if (!finished || !startedAt) return;
    if (!name.trim()) return setError("Ange ett namn.");
    const payload = {
      name: name.trim(),
      timeMs: Date.now() - startedAt,
      attempts: history.length,
      wordLength: secret.length,
      uniqueOnly,
      guesses: history.map(h => h.word)
    };
    const res = await fetch("/api/highscores", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error||"Kunde inte spara.");
    window.location.href = "/highscores";
  }

  return (
    <div className="split">
      <div className="panel">
        <h2>Inställningar</h2>
        <label>Ordlängd</label>
        <select value={length} onChange={e=>setLength(parseInt(e.target.value))}>
          {[4,5,6,7,8].map(n=><option key={n} value={n}>{n}</option>)}
        </select>
        <label>
          <input type="checkbox" checked={uniqueOnly} onChange={e=>setUniqueOnly(e.target.checked)} />
          Endast unika bokstäver
        </label>
        <div style={{marginTop:8}}>
          <button className="btn" onClick={startGame}>Starta nytt spel</button>
        </div>
        {secret
          ? <p className="muted">Ett ord är valt. Längd: <b>{secret.length}</b>.</p>
          : <p className="muted">Tryck "Starta nytt spel".</p>}
      </div>

      <div className="panel" style={{flex:"2 1 420px"}}>
        <h2>Spel</h2>
        {error && <p className="error">{error}</p>}
        {history.map((h,i)=><Tiles key={i} word={h.word} feedback={h.feedback}/>)}
        {!finished && (
          <form onSubmit={submitGuess} style={{marginTop:12}}>
            <label>Gissa ordet</label>
            <input type="text" value={guess} onChange={e=>setGuess(e.target.value)}
                   placeholder={secret?`Skriv ${secret.length} bokstäver...`:'Starta först'} disabled={!secret}/>
            <div style={{marginTop:8}}>
              <button className="btn" type="submit" disabled={!secret}>Gissa</button>
            </div>
          </form>
        )}
        {finished && (
          <div style={{marginTop:12}}>
            <p className="success"><b>Rätt!</b> Ordet var <b>{secret.toUpperCase()}</b>.</p>
            <p>Antal gissningar: <b>{history.length}</b></p>
            <p>Tid: <b>{((Date.now()-startedAt)/1000).toFixed(2)}s</b></p>
            <label>Ditt namn</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Skriv ditt namn..."/>
            <div style={{marginTop:8, display:"flex", gap:8}}>
              <button className="btn" onClick={submitScore}>Skicka till highscore</button>
              <a className="btn" href="/highscores">Visa highscore</a>
              <button className="btn" onClick={startGame}>Spela igen</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
