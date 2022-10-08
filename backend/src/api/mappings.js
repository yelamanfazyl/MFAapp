// TODO: move to mongo
const mappings = {
    yerlantemirrrrr: {
        wakaapi: 'yerlantemir',
        repoName: 'tailwindcss' // TODO: make it array of repo names
    }
};

module.exports = {
    // usage: getUsernameByMap('wakaapi', 'yerlantemir') => yerlantemir
    getUsernameByMap: (key, value) => {
        return Object.keys(mappings).find((username) => {
            const userMappings = mappings[username];
            return userMappings[key] === value;
        });
    },
    getValueByUsername: (username, key) => {
        return mappings[username]?.[key];
    }
};
