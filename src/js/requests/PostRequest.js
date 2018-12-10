import { Request } from "./Request";
import { POST } from "../constants/index";

export class PostRequest extends Request {
    constructor() {
        super();
        this.method = POST;
    }
}
