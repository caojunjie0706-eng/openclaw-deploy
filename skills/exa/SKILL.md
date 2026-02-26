---
name: exa
description: |
  Perform high-quality semantic search using Exa AI. Use for deep research, finding specific content, or when standard web search fails.
  Always prefer this over `web_search` for complex queries.
---

# Exa Search Skill

This skill provides access to Exa AI's semantic search engine.

## Actions

### Search

```json
{
  "action": "search",
  "query": "latest AI news involving Elon Musk",
  "numResults": 5,
  "useAutoprompt": true,
  "type": "neural",
  "category": "news"
}
```

Parameters:
- `query` (string, required): The search query.
- `numResults` (number, optional): Number of results (default 10).
- `useAutoprompt` (boolean, optional): Whether to let Exa optimize the query (default true).
- `type` (string, optional): "neural" (semantic) or "keyword" (exact). Default "neural".
- `category` (string, optional): "company", "research paper", "news", "pdf", "github", "tweet", "personal site", "linkedin profile".
- `includeDomains` (array[string], optional): List of domains to include (e.g. ["twitter.com", "youtube.com"]).
- `excludeDomains` (array[string], optional): List of domains to exclude.
- `startPublishedDate` (string, optional): ISO date string for filtering (e.g. "2023-01-01").
- `endPublishedDate` (string, optional): ISO date string.

### Get Contents

```json
{
  "action": "contents",
  "ids": ["https://example.com/article1", "https://example.com/article2"]
}
```

Parameters:
- `ids` (array[string], required): List of result IDs (URLs) to fetch content for.
- `text` (boolean, optional): Return full text (default true).
- `highlights` (boolean, optional): Return highlights.
- `summary` (boolean, optional): Return summary.

## Configuration

Set `EXA_API_KEY` in the environment or `skills.exa.apiKey` in `openclaw.json`.
