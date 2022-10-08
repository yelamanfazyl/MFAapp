const axios = require('axios');
const { getUsernameByMap } = require('./mappings');

const WAKAAPI_ENDPOINT = 'http://159.65.121.101:3000/api';
const API_KEY = 'ZjA0OTRkMzEtMjMwMC00NjQ3LTk1NjktZWNhOTQ4NzFhZTRj';
const headers = {
    Authorization: `Basic ${API_KEY}`
};

module.exports = class WakaAPI {
    constructor() {}

    async getUserStats(username = 'yerlantemir', range = 'today') {
        try {
            const wakaStatsResp = await axios.get(
                `${WAKAAPI_ENDPOINT}/compat/wakatime/v1/users/${username}/summaries?range=${range}`,
                {
                    headers
                }
            );
            const data = wakaStatsResp.data.data?.[0];
            return {
                languages: data.languages?.map(
                    (languageStats) => languageStats.name
                ),
                time: data.grand_total
            };
        } catch (error) {
            console.log(error);
        }
    }
};
