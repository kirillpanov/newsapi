import { PopUp } from "./PopUp";

// TODO: add mapper function to map errors
export class ErrorHandler {
    constructor(error) {
        this.error = error;
        this.popUp = PopUp.getInstance();
        this.showPopUp();
    }

    showPopUp() {
        this.popUp.showPopUp(this.error);
    }
}
