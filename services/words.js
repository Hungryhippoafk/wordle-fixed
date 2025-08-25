const WORDS = [
  "game","code","time","wolf","moon","fire","dark","kind","wind","salt","rock","tree",
  "apple","house","green","light","sound","storm","sweet","world","chair","heart","mouse",
  "brick","steel","flame","sugar","bread","plant","grape",
  "orange","button","silver","little","mother","father","spirit","planet","castle","friend",
  "winter","throat","pillow","rocket",
  "monster","kingdom","diamond","picture","station","village","compass","blanket","harvest","lantern",
  "notebook","airplane","daughter","province","umbrella","creature","sandwich","wildlife"
].map(w => w.toLowerCase());

function hasAllUniqueLetters(word) {
  return new Set(word).size === word.length;
}

function pickRandomWord(len, uniqueOnly) {
  const pool = WORDS.filter(
    w => w.length === len && (!uniqueOnly || hasAllUniqueLetters(w))
  );
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

module.exports = { pickRandomWord, hasAllUniqueLetters };
