# Deployment receipt

- **Repo:** https://github.com/mrjkorea/news-word-practice
- **Pages URL:** https://mrjkorea.github.io/news-word-practice/
- **Pages source:** `main` branch, `/` (root), legacy static
- **Commit:** `5d8d538` (initial site + word data)

## curl proof (2026-09-19)

```text
$ curl -sS -o /dev/null -w "index: %{http_code}\n" "https://mrjkorea.github.io/news-word-practice/"
index: 200

$ curl -sS -o /dev/null -w "practice: %{http_code}\n" "https://mrjkorea.github.io/news-word-practice/practice.html?date=2026-09-18"
practice: 200

$ curl -sS -o /dev/null -w "test: %{http_code}\n" "https://mrjkorea.github.io/news-word-practice/test.html?date=2026-09-18"
test: 200

$ curl -sS -o /dev/null -w "words-index: %{http_code}\n" "https://mrjkorea.github.io/news-word-practice/words/index.json"
words-index: 200

$ curl -sS "https://mrjkorea.github.io/news-word-practice/" | head -1
<!DOCTYPE html>
```

GitHub Pages API response when enabling:

```json
{"html_url":"https://mrjkorea.github.io/news-word-practice/","build_type":"legacy","source":{"branch":"main","path":"/"},"public":true}
```
