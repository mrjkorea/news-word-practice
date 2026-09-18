(function () {
  const date = NWP.getQueryDate();
  const form = document.getElementById('quiz');
  const results = document.getElementById('results');
  const actions = document.getElementById('actions');
  const storageNote = document.getElementById('storage-note');

  let day = null;
  let questions = [];

  if (!date) {
    location.href = 'index.html';
    return;
  }

  document.getElementById('practice-link').href =
    `practice.html?date=${encodeURIComponent(date)}`;

  function renderQuestions() {
    form.innerHTML = '';
    results.classList.add('hidden');
    results.innerHTML = '';
    questions.forEach((q, i) => {
      const div = document.createElement('div');
      div.className = 'q';
      let body = `<div><span class="q-num">${i + 1}.</span><span class="meta">MC</span></div>`;
      body += `<div class="q-stem">${NWP.esc(q.prompt)}</div>`;
      body += '<div class="choices">';
      (q.choices || []).forEach((choice, j) => {
        body += `<label><input type="radio" name="q${i}" value="${j}" /> ${NWP.esc(choice)}</label>`;
      });
      body += '</div>';
      body += `<div class="explain-slot" id="explain-${i}"></div>`;
      div.innerHTML = body;
      form.appendChild(div);
    });
  }

  function grade() {
    let correct = 0;
    const mistakes = [];
    questions.forEach((q, i) => {
      const el = form.querySelector(`input[name="q${i}"]:checked`);
      const picked = el ? Number(el.value) : -1;
      const ok = picked === q.answerIndex;
      if (ok) correct += 1;
      else {
        const right = q.choices[q.answerIndex];
        mistakes.push({ i, q, picked, right });
      }
      const slot = document.getElementById(`explain-${i}`);
      if (slot) {
        slot.innerHTML = ok
          ? '<p class="ok">정답</p>'
          : `<p class="bad">오답 · 정답: ${NWP.esc(q.choices[q.answerIndex])}</p>`;
      }
    });

    const total = questions.length;
    const stats = NWPStorage.recordAttempt(date, correct, total);

    let html = `<div class="score-banner">
      <div class="big">${correct} / ${total}</div>
      <div class="sub">${Math.round((correct / total) * 100)}% · ${stats.attempts}번째 시도</div>
    </div>`;
    if (stats.bestScore != null && stats.bestScore !== correct) {
      html += `<p class="meta">이 날짜 최고 점수: ${stats.bestScore}/${total}</p>`;
    }
    if (!NWPStorage.canStoreForDate(date)) {
      html += '<p class="meta">오늘 날짜 세트가 아니면 점수는 저장되지 않습니다.</p>';
    }
    if (mistakes.length) {
      html += '<h3>오답</h3>';
      mistakes.forEach((m) => {
        html += `<div class="mistake">
          <strong>${m.i + 1}. ${NWP.esc(m.q.prompt)}</strong>
          <div class="meta">선택: ${m.picked >= 0 ? NWP.esc(m.q.choices[m.picked]) : '(없음)'}</div>
        </div>`;
      });
    }
    results.innerHTML = html;
    results.classList.remove('hidden');
    actions.querySelector('#submit').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.getElementById('submit').addEventListener('click', grade);
  document.getElementById('reset').addEventListener('click', () => {
    renderQuestions();
    actions.querySelector('#submit').classList.remove('hidden');
  });

  NWP.loadDay(date)
    .then((data) => {
      day = data;
      questions = NWP.getTestQuestions(day);
      document.title = `${day.title || date} · 테스트`;
      document.getElementById('title').textContent = day.title || `News Words · ${date}`;
      document.getElementById('sub').textContent = `${questions.length}문항 · 제출 후 채점`;
      const stats = NWPStorage.readStats(date);
      storageNote.textContent = NWPStorage.formatScoreLine(stats, questions.length);
      renderQuestions();
    })
    .catch(() => {
      document.getElementById('title').textContent = '세트를 찾을 수 없습니다';
    });
})();
