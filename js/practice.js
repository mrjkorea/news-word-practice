(function () {
  const date = NWP.getQueryDate();
  const titleEl = document.getElementById('title');
  const main = document.getElementById('main');
  const err = document.getElementById('err');
  const card = document.getElementById('card');
  const scene = document.getElementById('scene');
  const frontText = document.getElementById('front-text');
  const backDef = document.getElementById('back-def');
  const backKo = document.getElementById('back-ko');
  const progress = document.getElementById('progress');
  const dotsEl = document.getElementById('dots');
  const goTest = document.getElementById('go-test');

  let words = [];
  let index = 0;

  if (!date) {
    location.href = 'index.html';
    return;
  }

  goTest.href = `test.html?date=${encodeURIComponent(date)}`;

  function setFlipped(on) {
    card.classList.toggle('is-flipped', on);
  }

  function renderCard() {
    const w = words[index];
    if (!w) return;
    setFlipped(false);
    frontText.textContent = w.en;
    backDef.textContent = w.def_en || '';
    const ko = (w.ko || []).filter(Boolean);
    if (ko.length) {
      backKo.textContent = ko.join(' · ');
      backKo.classList.remove('hidden');
    } else {
      backKo.classList.add('hidden');
    }
    progress.textContent = `${index + 1} / ${words.length}`;
    dotsEl.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    words.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'dot';
      b.setAttribute('aria-label', `단어 ${i + 1}`);
      b.addEventListener('click', () => {
        index = i;
        renderCard();
      });
      dotsEl.appendChild(b);
    });
  }

  function go(delta) {
    if (!words.length) return;
    index = (index + delta + words.length) % words.length;
    renderCard();
  }

  scene.addEventListener('click', () => setFlipped(!card.classList.contains('is-flipped')));
  scene.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFlipped(!card.classList.contains('is-flipped'));
    }
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });

  document.getElementById('prev').addEventListener('click', () => go(-1));
  document.getElementById('next').addEventListener('click', () => go(1));
  document.getElementById('shuffle').addEventListener('click', () => {
    words = NWP.shuffle(words);
    index = 0;
    buildDots();
    renderCard();
  });

  NWP.loadDay(date)
    .then((day) => {
      document.title = `${day.title || date} · 연습`;
      titleEl.textContent = day.title || `News Words · ${date}`;
      const sub = document.getElementById('sub');
      if (day.headline) sub.textContent = day.headline;
      words = day.words || [];
      if (!words.length) throw new Error('empty');
      buildDots();
      renderCard();
      main.classList.remove('hidden');
    })
    .catch(() => {
      titleEl.textContent = '세트를 찾을 수 없습니다';
      err.textContent = `words/${date}.json 이 없습니다.`;
      err.classList.remove('hidden');
    });
})();
