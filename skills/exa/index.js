// OpenClaw uses Node.js v18+, so native fetch is available.

const EXA_API_KEY = process.env.EXA_API_KEY || "__API_KEY_PLACEHOLDER__"; // Will be injected or read from config

async function exaSearch(params) {
  const { query, numResults = 10, useAutoprompt = true, type = 'neural', category, includeDomains, excludeDomains, startPublishedDate, endPublishedDate } = params;

  const body = {
    query,
    numResults,
    useAutoprompt,
    type,
    category,
    includeDomains,
    excludeDomains,
    startPublishedDate,
    endPublishedDate
  };

  // Remove undefined/null keys
  Object.keys(body).forEach(key => body[key] === undefined && delete body[key]);

  const response = await fetch('https://api.exa.ai/search', {
    method: 'POST',
    headers: {
      'x-api-key': EXA_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Exa API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return await response.json();
}

async function exaContents(params) {
  const { ids, text = true, highlights, summary } = params;

  const body = {
    ids,
    text,
    highlights,
    summary
  };
    // Remove undefined/null keys
  Object.keys(body).forEach(key => body[key] === undefined && delete body[key]);

  const response = await fetch('https://api.exa.ai/contents', {
    method: 'POST',
    headers: {
      'x-api-key': EXA_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

   if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Exa API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return await response.json();
}


export default function (api) {
    // Get API key from config
    const config = api.config?.skills?.exa || {};
    const apiKey = config.apiKey || process.env.EXA_API_KEY;

    if (!apiKey) {
        api.logger.warn("Exa skill disabled: Missing API Key (skills.exa.apiKey)");
        return;
    }

    // Override the placeholder with the actual key
    // In a real implementation, we'd pass config to the functions, but for this quick script:
    global.EXA_API_KEY_RUNTIME = apiKey; // A hack, or better:
    
    const callExa = async (endpoint, body) => {
         const response = await fetch(`https://api.exa.ai/${endpoint}`, {
            method: 'POST',
            headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Exa API error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return await response.json();
    }

  api.registerTool({
    name: "exa_search",
    description: "Search the web using Exa AI neural search. Returns semantic results, not just keywords.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
        numResults: { type: "number", description: "Number of results (default 10)" },
        useAutoprompt: { type: "boolean", description: "Let Exa optimize query (default true)" },
        type: { type: "string", enum: ["neural", "keyword"], description: "Search type" },
        category: { type: "string", description: "Filter by category (news, company, research paper, etc.)" },
        includeDomains: { type: "array", items: { type: "string" }, description: "Domains to include" },
        excludeDomains: { type: "array", items: { type: "string" }, description: "Domains to exclude" },
        startPublishedDate: { type: "string", description: "Start date (ISO)" },
        endPublishedDate: { type: "string", description: "End date (ISO)" }
      },
      required: ["query"]
    },
    async execute(id, params) {
      try {
        const result = await callExa('search', params);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return { isError: true, content: [{ type: "text", text: error.message }] };
      }
    }
  });

  api.registerTool({
    name: "exa_contents",
    description: "Get full text contents for search results from Exa.",
    parameters: {
      type: "object",
      properties: {
        ids: { type: "array", items: { type: "string" }, description: "Result IDs (URLs)" },
        text: { type: "boolean", description: "Return full text (default true)" },
        highlights: { type: "object", description: "Highlight options" }, // Simplified
        summary: { type: "object", description: "Summary options" }
      },
      required: ["ids"]
    },
    async execute(id, params) {
        try {
            const result = await callExa('contents', params);
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
            return { isError: true, content: [{ type: "text", text: error.message }] };
        }
    }
  });
}
