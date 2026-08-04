const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);

  // Passthrough static assets
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy({ public: "/" });

  // Posts collections
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/*.md");
  });
  eleventyConfig.addCollection("postsPt", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/pt-br/posts/*.md");
  });

  // Global locale default
  eleventyConfig.addGlobalData("locale", "en");

  // i18n lookup filter: {{ 'posts' | i18n(locale) }}
  eleventyConfig.addFilter("i18n", (key, locale) => {
    const i18n = require("./src/_data/i18n");
    const t = i18n[locale] || i18n.en;
    return t[key] || key;
  });

  // Date formatting filter (locale-aware)
  eleventyConfig.addFilter("readableDate", (date, locale) => {
    const i18n = require("./src/_data/i18n");
    const t = i18n[locale] || i18n.en;
    const d = new Date(date);
    const day = d.getUTCDate();
    return `${t.months[d.getUTCMonth()]} ${t.ordinal(day)}, ${d.getUTCFullYear()}`;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
