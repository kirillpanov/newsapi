import { Source } from "./Source";
import { SourceDropDown } from "./SourceDropDown";
import { NewsComponent } from "./NewsComponent";

export class App {
    constructor(apiService) {
        this.apiService = apiService;
        this.selectedSourcesElement = document.getElementById(
            "selected-sources"
        );
        this._selectedSources = [];
        this.sourceTags = [];
        this.sourceDropDown = new SourceDropDown();
        this.newsComponent = new NewsComponent();
    }

    get selectedSources() {
        if (this.sources) {
            this._selectedSources = this.sources.filter(
                ({ selected }) => selected
            );
        }
        return this._selectedSources;
    }

    selectSource(index) {
        this.sources[index].selected = true;
    }

    toggleSourceSelection(sourceId) {
        const targetSource = this.sources.find(({ id }) => id === sourceId);
        if (targetSource) {
            targetSource.selected = !targetSource.selected;
            this.renderSources();
        }
    }

    init() {
        this.apiService.sources
            .then(({ sources }) => {
                this.sources = sources.map(source =>
                    // Object.assign is used instead of spread
                    // because of webpack issue https://github.com/webpack/webpack/issues/5548
                    Object.assign({}, source, { selected: false })
                );
            })
            .then(() => this.observeAppMutation())
            .then(() => this.renderSources())
            .catch(_ => this.renderSources());
    }

    observeAppMutation() {
        const appElement = document.getElementById("sources");
        const observer = new MutationObserver(() =>
            this.addSelectionListeners()
        );
        const config = { attributes: true, childList: true, subtree: true };
        observer.observe(appElement, config);
    }

    renderSources() {
        let selectedSources = "";
        if (this.selectedSources.length) {
            selectedSources = this.selectedSources.reduce((section, source) => {
                const sourceComponent = new Source(source);
                this.sourceTags = [...this.sourceTags, sourceComponent];
                return `${section}${sourceComponent.init()}`;
            }, "<h2>Sources:</h2>");
        }
        this.selectedSourcesElement.innerHTML = selectedSources;
        this.updateDropDown();
        this.updateNewsComponent();
    }

    updateDropDown() {
        this.sourceDropDown.updateSources(this.sources);
    }

    updateNewsComponent() {
        if (this.selectedSources.length) {
            this.apiService
                .getNews(this.selectedSources)
                .then(news =>
                    news.reduce(
                        (news, { articles }) => [...news, ...articles],
                        []
                    )
                )
                .then(newsList =>
                    newsList.sort(
                        (a, b) =>
                            new Date(a.publishedAt) - new Date(b.publishedAt)
                    )
                )
                .then(newsList => this.newsComponent.updateNews(newsList));
        } else {
            this.newsComponent.updateNews();
        }
    }

    addSelectionListeners() {
        const checkBoxSelector = `[${this.sourceDropDown.selector}]`;
        const checkBoxes = [...document.querySelectorAll(checkBoxSelector)];
        if (checkBoxes.length) {
            checkBoxes.forEach(checkBox =>
                checkBox.addEventListener("change", event => {
                    this.toggleSourceSelection(event.target.id);
                })
            );
        }
        if (this.sourceTags.length) {
            const unselectButtonSelector = `[${this.sourceTags[0].selector}]`;

            const unselectButtons = [
                ...document.querySelectorAll(unselectButtonSelector)
            ];

            if (unselectButtons.length) {
                unselectButtons.forEach(button =>
                    button.addEventListener("click", event => {
                        this.toggleSourceSelection(event.target.id);
                    })
                );
            }
        }
    }
}
