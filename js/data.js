(function (global) {
  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function loadIndex() {
    return fetch('words/index.json').then((r) => {
      if (!r.ok) throw new Error('index');
      return r.json();
    });
  }

  function loadDay(date) {
    return fetch(`words/${encodeURIComponent(date)}.json`).then((r) => {
      if (!r.ok) throw new Error('day');
      return r.json();
    });
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** Build MC items from words when test[] is missing or empty. */
  function generateTestFromWords(day) {
    const words = day.words || [];
    return words.map((w, idx) => {
      const others = words.filter((x) => x.en !== w.en).map((x) => x.en);
      const distractors = shuffle(others).slice(0, 3);
      const choices = shuffle([w.en, ...distractors]);
      const answerIndex = choices.indexOf(w.en);
      const prompt = `${w.def_en} — which word?`;
      return {
        id: idx + 1,
        type: 'MC',
        prompt,
        choices,
        answerIndex,
        hintKo: w.ko && w.ko.length ? w.ko.join(', ') : w.def_en,
        wordId: w.id,
      };
    });
  }

  function getTestQuestions(day) {
    if (day.test && day.test.length) return day.test;
    return generateTestFromWords(day);
  }

  function getQueryDate() {
    const params = new URLSearchParams(location.search);
    return params.get('date') || '';
  }

  global.NWP = {
    esc,
    loadIndex,
    loadDay,
    getTestQuestions,
    getQueryDate,
    shuffle,
  };
})(window);
