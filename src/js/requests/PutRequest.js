import { Request } from "./Request";
import { PUT } from "../constants/index";

export class PutRequest extends Request {
    constructor() {
        super();
        this.method = PUT;
    }
}
