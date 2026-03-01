const axios = require('axios');

async function search(query, category, domains) {
    try {
        const response = await axios.post('https://api.exa.ai/search', {
            query: query,
            numResults: 5,
            includeDomains: domains,
            startPublishedDate: "2026-02-28T01:00:00Z",
            category: category
        }, {
            headers: {
                'x-api-key': process.env.EXA_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        return { error: error.message };
    }
}

async function run() {
    const queries = [
        { q: "Sam Altman Greg Brockman Andrej Karpathy latest AI announcements", c: "tweet", d: ["twitter.com", "x.com"], f: "twitter_results.json" },
        { q: "Wes Roth Matt Wolfe latest AI news deep dive", c: "news", d: ["youtube.com"], f: "youtube_results.json" },
        { q: "Amazon Alibaba ByteDance Temu AI e-commerce commercialization news", c: "news", d: [], f: "ecommerce_results.json" },
        { q: "trending AI open source projects GitHub vibe coding", c: "github", d: ["github.com"], f: "github_results.json" }
    ];

    for (const item of queries) {
        const result = await search(item.q, item.c, item.d);
        require('fs').writeFileSync(item.f, JSON.stringify(result, null, 2));
    }
}

run();
