import { fetch } from "whatwg-fetch";

import { GET, POST, PUT } from "../constants/index";
import { GetRequest, PostRequest, PutRequest } from "../requests/index";

export class RequestFactory {
    create(url, requestType) {
        let init;
        switch (requestType) {
            case GET:
                init = new GetRequest();
            case POST:
                init = new PostRequest();
            case PUT:
                init = new PutRequest();
            default:
                init = new GetRequest();
        }
        return fetch(url, init).then(r => r.json());
    }
}
