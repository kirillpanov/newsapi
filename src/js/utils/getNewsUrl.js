export const getNewsUrl = (key, source) =>
    `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${key}`;
