# News Word Practice

Static site for daily news vocabulary (10 words per day). Hosted on GitHub Pages.

**Live:** https://mrjkorea.github.io/news-word-practice/

## Pages

| Page | URL |
|------|-----|
| Date index | `index.html` |
| Flip-card practice | `practice.html?date=YYYY-MM-DD` |
| Multiple-choice test | `test.html?date=YYYY-MM-DD` |

## Add a new day

1. Create `words/YYYY-MM-DD.json` with this shape:

```json
{
  "id": "2026-09-19",
  "date": "2026-09-19",
  "title": "News Words · 2026-09-19",
  "headline": "optional short topic line",
  "words": [
    {
      "id": "w1",
      "en": "example",
      "ko": [],
      "def_en": "English definition shown on the card and in tests",
      "example": "Optional example sentence."
    }
  ],
  "test": [
    {
      "id": 1,
      "type": "MC",
      "prompt": "English definition — which word?",
      "choices": ["a", "b", "example", "d"],
      "answerIndex": 2,
      "hintKo": "optional Korean hint"
    }
  ]
}
```

- Include **10** entries in `words`.
- `ko` may be an empty array `[]` or strings like `["예시"]`.
- `test` is optional: if missing or empty, the site builds 10 MC questions from `words` automatically.

2. Add an entry at the **top** of `words/index.json` (newest first):

```json
{
  "id": "2026-09-19",
  "date": "2026-09-19",
  "title": "News Words · 2026-09-19",
  "wordCount": 10,
  "data": "words/2026-09-19.json"
}
```

3. Commit and push to `main`. GitHub Pages serves from the repo root (`.nojekyll` is included).

## Local preview

```bash
python3 -m http.server 8080
```

Open http://localhost:8080/

## Scores

Test scores and attempt counts are stored in `localStorage` only for the lesson whose `date` matches **today’s calendar date** on the device. Older sets can still be taken; scores are not persisted.
