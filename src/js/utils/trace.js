import { GET } from "../constants/index";

export function traceRequestCalls(requestFactory) {
    const handler = {
        get(target, propKey) {
            const origMethod = target[propKey];
            return function(url, method = GET) {
                const result = origMethod.call(this, url, method);
                console.log(`${propKey} was called with url: ${url} and method: ${method}`);
                return result;
            };
        }
    };
    return new Proxy(requestFactory, handler);
}
