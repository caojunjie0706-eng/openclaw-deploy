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
        if (name === 'exa_contents') {
            global.exaContents = execute;
        }
    },
    logger: { warn: console.warn }
};

exa(mockApi);

const run = async () => {
    const ids = [
        "https://www.starterstory.com/breakdowns/dan-koe/model",
        "https://growthinreverse.com/dan-koe/",
        "https://medium.com/@moneytent/how-dan-koe-achieves-98-profit-with-no-employees-a-4-2m-success-story-ca2bb1cf0186"
    ];
    try {
        const result = await global.exaContents(null, { ids, text: true, summary: {} });
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error(e);
    }
};

run();
