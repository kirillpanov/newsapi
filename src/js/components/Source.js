export class Source {
    constructor({ name, id }) {
        this.selector = "data-source-tag";
        this.source = name;
        this.id = id;
    }

    init() {
        return `<div class="source-tag">
            <span>${this.source}</span>
            <button ${this.selector} id=${
            this.id
        } class="close-button">&#735</button>
        </div>`;
    }
}
