import "./PopUp.css";

export class PopUp {
    constructor() {
        this.errorText = "";
        this.body = this._getBodyElement();
        this.popUpElement = this._getPopUp();
    }
    static getInstance() {
        if (!PopUp.instance) {
            PopUp.instance = new PopUp();
        }
        return PopUp.instance;
    }

    showPopUp(errorText) {
        this._setError(errorText);
        this._updatePopUp();
        this.body.appendChild(this.popUpElement);
        this._addAcceptListener();
    }

    hidePopUp() {
        this.body.removeChild(this.popUpElement);
    }

    _getBodyElement() {
        const collection = document.getElementsByTagName("body");
        const body = [...collection][0];
        return body;
    }

    _getPopUp() {
        const popUp = document.createElement("div");
        popUp.classList.add("pop-up-overlay");
        return popUp;
    }

    _updatePopUp() {
        this.popUpElement.innerHTML = `
            <div class="pop-up">
                <h2>Error occured</h2>
                <p>${this.errorText}</p>
                <button class="accept-button" id="accept">Acknowledge</button>
            </div>
        `;
    }

    _setError(errorText) {
        this.errorText = errorText;
    }

    _addAcceptListener() {
        document.getElementById("accept").addEventListener("click", () => this.hidePopUp());
    }
}
