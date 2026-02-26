import exa from './skills/exa/index.js';

const mockApi = {
    config: {
        skills: {
            exa: {
                apiKey: "ddb39a5b-40c9-4a8c-9f27-fe7833ea1b5d"
            }
        }
    },
    registerTool: ({ name, execute }) => {
        if (name === 'exa_search') {
            global.exaSearch = execute;
        }
    },
    logger: { warn: console.warn }
};

exa(mockApi);

const run = async () => {
    const query = "Dan Koe tech stack tools list 2024 2025 TweetHunter Beehiiv Kortex";
    try {
        const result = await global.exaSearch(null, { query, numResults: 5 });
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error(e);
    }
};

run();
