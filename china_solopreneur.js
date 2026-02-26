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
    const query = "国内 独立开发者 一人公司 知识付费 成功案例 2024 2025 小红书 知识博主 商业模式";
    try {
        const result = await global.exaSearch(null, { query, numResults: 10, type: "neural" });
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error(e);
    }
};

run();
