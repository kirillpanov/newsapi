import { RequestFactory } from "./RequestFactory";
import { apiKey } from "../constants/index";
import { traceRequestCalls, getNewsUrl, getSourcesUrl } from "../utils/index";

export class ApiService {
    constructor() {
        this.requestFactory = traceRequestCalls(new RequestFactory());
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
