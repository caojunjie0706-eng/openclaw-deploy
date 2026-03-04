import api_module from './index.js';

const mockApi = {
    config: {
        skills: {
            exa: {
                apiKey: process.env.EXA_API_KEY
            }
        }
    },
    logger: {
        warn: console.warn,
        info: console.log
    },
    registerTool: ({ name, execute }) => {
        if (name === 'exa_search') {
            global.exa_search = execute;
        }
    }
};

api_module(mockApi);

if (global.exa_search) {
    const params = JSON.parse(process.argv[2]);
    const result = await global.exa_search('test-id', params);
    console.log(JSON.stringify(result, null, 2));
} else {
    console.error("Failed to register exa_search");
}
