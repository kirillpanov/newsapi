/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_App__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_index__ = __webpack_require__(3);



const newsApiService = new __WEBPACK_IMPORTED_MODULE_1__services_index__["a" /* ApiService */]();
const app = new __WEBPACK_IMPORTED_MODULE_0__components_App__["a" /* App */](newsApiService);
app.init();


/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Source__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SourceDropDown__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__NewsComponent__ = __webpack_require__(7);




class App {
    constructor(apiService) {
        this.apiService = apiService;
        this.selectedSourcesElement = document.getElementById(
            "selected-sources"
        );
        this._selectedSources = [];
        this.sourceTags = [];
        this.sourceDropDown = new __WEBPACK_IMPORTED_MODULE_1__SourceDropDown__["a" /* SourceDropDown */]();
        this.newsComponent = new __WEBPACK_IMPORTED_MODULE_2__NewsComponent__["a" /* NewsComponent */]();
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
                const sourceComponent = new __WEBPACK_IMPORTED_MODULE_0__Source__["a" /* Source */](source);
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
/* harmony export (immutable) */ __webpack_exports__["a"] = App;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ApiService__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__ApiService__["a"]; });



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const apiKey = "18bc004995294223a2d658b2067ac6a2";
const getSourcesUrl = key => `https://newsapi.org/v2/sources?apiKey=${key}`;
const getNewsUrl = (key, source) =>
    `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${key}`;

class ApiService {
    get sources() {
        return this._sources ? this._sources : this._getSources();
    }

    getNews(sources) {
        return Promise.all(
            sources.map(({ id }) => {
                const url = getNewsUrl(apiKey, id);
                return fetch(url).then(r => r.json());
            })
        );
    }

    _getSources() {
        const url = getSourcesUrl(apiKey);
        this._sources = fetch(url).then(r => r.json());
        return this._sources;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ApiService;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Source {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Source;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class SourceDropDown {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = SourceDropDown;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const defaultUrl =
    "https://upload.wikimedia.org/wikipedia/commons/7/75/No_image_available.png";

class NewsComponent {
    constructor() {
        this.element = document.getElementById("news");
    }

    updateNews(list = []) {
        if (list.length) {
            this.element.innerHTML = `
            <h2>News</h2>
            <ul class="news-list">
                ${list.reduce(
                    (acc, item) =>
                        `${acc}<li class="news-item"><a class="link" target="_blanck" href=${
                            item.url
                        }><h3>${item.title}</h3><img class="news-image" src=${
                            item.urlToImage ? item.urlToImage : defaultUrl
                        }><p>${item.description}</p></a></li>`,
                    ""
                )}
            </ul>`;
        } else {
            this.element.innerHTML = "";
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = NewsComponent;



/***/ })
/******/ ]);