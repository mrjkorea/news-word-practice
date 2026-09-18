(function (global) {
  const PREFIX = 'news-word-practice:';

  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  /** Scores persist only for the lesson date that matches the user's calendar today. */
  function canStoreForDate(lessonDate) {
    return lessonDate === todayKey();
  }

  function storageKey(lessonDate) {
    return `${PREFIX}test:${lessonDate}`;
  }

  function readStats(lessonDate) {
    if (!canStoreForDate(lessonDate)) {
      return { attempts: 0, bestScore: null, lastScore: null, stored: false };
    }
    try {
      const raw = localStorage.getItem(storageKey(lessonDate));
      if (!raw) return { attempts: 0, bestScore: null, lastScore: null, stored: true };
      const data = JSON.parse(raw);
      return {
        attempts: data.attempts || 0,
        bestScore: data.bestScore ?? null,
        lastScore: data.lastScore ?? null,
        stored: true,
      };
    } catch {
      return { attempts: 0, bestScore: null, lastScore: null, stored: true };
    }
  }

  function recordAttempt(lessonDate, score, total) {
    if (!canStoreForDate(lessonDate)) return readStats(lessonDate);
    const prev = readStats(lessonDate);
    const bestScore =
      prev.bestScore == null ? score : Math.max(prev.bestScore, score);
    const next = {
      attempts: prev.attempts + 1,
      bestScore,
      lastScore: score,
      total,
      updatedAt: Date.now(),
    };
    try {
      localStorage.setItem(storageKey(lessonDate), JSON.stringify(next));
    } catch {
      /* quota or private mode */
    }
    return {
      attempts: next.attempts,
      bestScore: next.bestScore,
      lastScore: next.lastScore,
      stored: true,
    };
  }

  function formatScoreLine(stats, total) {
    if (!stats.stored) {
      return '점수 저장: 오늘 날짜 세트만 (브라우저에 저장)';
    }
    if (stats.attempts === 0) return '아직 테스트 없음';
    const pct = total
      ? Math.round((stats.lastScore / total) * 100)
      : 0;
    let line = `최근 ${stats.lastScore}/${total} (${pct}%) · ${stats.attempts}회`;
    if (stats.bestScore != null && stats.bestScore !== stats.lastScore) {
      line += ` · 최고 ${stats.bestScore}/${total}`;
    }
    return line;
  }

  global.NWPStorage = {
    todayKey,
    canStoreForDate,
    readStats,
    recordAttempt,
    formatScoreLine,
  };
})(window);
