import { App } from "./components/App";
import { ApiService } from "./services/index";

const newsApiService = new ApiService();
const app = new App(newsApiService);
app.init();
