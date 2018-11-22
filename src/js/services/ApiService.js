import { fetch } from "whatwg-fetch";

const apiKey = "18bc004995294223a2d658b2067ac6a2";
const getSourcesUrl = key => `https://newsapi.org/v2/sources?apiKey=${key}`;
const getNewsUrl = (key, source) =>
    `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${key}`;

export class ApiService {
    get sources() {
        return this._sources ? this._sources : this._getSources();
    }

    getNews(sources) {
        return Promise.all(
            sources.map(({ id }) => {
                const url = getNewsUrl(apiKey, id);
                return fetch(url).then(r => r.json());
            })
        );
    }

    _getSources() {
        const url = getSourcesUrl(apiKey);
        this._sources = fetch(url).then(r => r.json());
        return this._sources;
    }
}
