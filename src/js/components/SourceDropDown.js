export class SourceDropDown {
    constructor() {
        this.sources = [];
        this.selector = "data-checkbox";
        this.showList = false;
        this.buttonTemplate =
            "<button class='manage-button' id='manage-button'>Manage Sources</button>";
        this.element = document.getElementById("source-drop-down");
        this.init();
    }

    init() {
        this.element.innerHTML = this.buttonTemplate;
        this.element.addEventListener("click", event => this.toggleList(event));
    }

    toggleList(event) {
        if (event.target.id === "manage-button") {
            this.showList = !this.showList;
            this.renderList();
        }
    }

    updateSources(sources) {
        this.sources = sources;
        this.renderList();
    }

    renderList() {
        if (this.showList) {
            this.element.innerHTML = `
            ${this.buttonTemplate}
            <ul class="source-list">
                ${this.sources.reduce(
                    (acc, { name, selected, id }) => `${acc}
                    <li>
                        <input type="checkbox" ${this.selector} id=${id} ${
                        selected ? "checked" : ""
                    }>
                        <span>${name}</span>
                    </li>`,
                    ""
                )}
            </ul>`;
        } else {
            this.element.innerHTML = this.buttonTemplate;
        }
    }
}
