import { RequestFactory } from "./RequestFactory";

const apiKey = "18bc004995294223a2d658b2067ac6a2";
const getSourcesUrl = key => `https://newsapi.org/v2/sources?apiKey=${key}`;
const getNewsUrl = (key, source) =>
    `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${key}`;

export class ApiService {
    constructor() {
        this.requestFactory = new RequestFactory();
    }

    get sources() {
        return this._sources ? this._sources : this._getSources();
    }

    getNews(sources) {
        return Promise.all(
            sources.map(({ id }) => {
                const url = getNewsUrl(apiKey, id);
                return this.requestFactory.create(url);
            })
        );
    }

    _getSources() {
        const url = getSourcesUrl(apiKey);
        this._sources = this.requestFactory.create(url);
        return this._sources;
    }
}
