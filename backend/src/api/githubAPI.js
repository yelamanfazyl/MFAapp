const { getMinutesDifference } = require('../utils.js');
const axios = require('axios');

const GRAPHQL_ENDPOINT_URL = 'https://api.github.com/graphql';
const ORG_NAME = 'tailwindlabs';
const CACHE_EXPIRE_MINUTES = 3;

const headers = {
    'content-type': 'application/json',
    Authorization: 'bearer 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'
};

const organizationsGraphQLQuery = `
        query getOrganizations($last: Int, $orgName: String!) {
            organization(login: $orgName) {
                repositories(last: $last) {
                    nodes {
                        name
                    }
                }
            }
        }
`;
module.exports = class GithubAPI {
    constructor() {
        this.cache = {
            organizations: {},
            commits: {}
        };
    }

    async getRepositories() {
        const prevRequest = this.cache.organizations;
        const now = new Date();

        if (
            prevRequest &&
            prevRequest.time &&
            getMinutesDifference(now, prevRequest.time) <= CACHE_EXPIRE_MINUTES
        ) {
            return prevRequest.data;
        }

        const response = await axios({
            url: GRAPHQL_ENDPOINT_URL,
            method: 'post',
            headers: headers,
            data: {
                query: organizationsGraphQLQuery,
                variables: {
                    last: 100,
                    orgName: ORG_NAME
                }
            }
        });

        this.cache.organizations = {
            data: response.data.data.organization.repositories.nodes,
            time: now
        };
        return response.data.data.organization.repositories.nodes;
    }

    async getRepoCommitsCount(reponame) {
        const prevRequest = this.cache.commits[reponame];
        const now = new Date();

        if (
            prevRequest &&
            prevRequest.time &&
            getMinutesDifference(now, prevRequest.time) <= CACHE_EXPIRE_MINUTES
        ) {
            return prevRequest.data;
        }

        const commitsResp = await axios.get(
            `https://api.github.com/repos/tailwindlabs/${reponame}/commits`,
            {
                headers
            }
        );
        let count = 0;
        if (commitsResp.headers.link) {
            const splitted = commitsResp.headers.link.split(';')[1];
            const startingIndex = splitted.indexOf('page=');

            count = splitted.slice(startingIndex + 5, splitted.length - 1);
        }

        this.cache.commits[reponame] = {
            data: count,
            time: now
        };
        return count;
    }
};
