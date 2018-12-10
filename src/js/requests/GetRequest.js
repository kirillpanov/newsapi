import { Request } from "./Request";
import { GET } from "../constants/index";

export class GetRequest extends Request {
    constructor() {
        super();
        this.method = GET;
    }
}
