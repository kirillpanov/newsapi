const defaultUrl =
    "https://upload.wikimedia.org/wikipedia/commons/7/75/No_image_available.png";

export class NewsComponent {
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
