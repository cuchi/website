<template>
  <main class="container col-6 col-lg-8 col-md-10 col-sm-11 pad-top" v-html="post"></main>
</template>

<script>
import axios from "axios";
import cheerio from "cheerio";

const notFoundError = { statusCode: 404, message: "Post not found" };

export default {
  asyncData: async ({ params, error }) => {
    if (params.post.includes("/")) {
      return error(notFoundError);
    }

    try {
      return {
        post: require(`~/assets/posts/${params.post}.md`).default
      };
    } catch {
      return error(notFoundError);
    }
  },

  head() {
    return { title: cheerio("h1", this.post).text() || "Post" };
  }
};
</script>

<style lang="scss">
h1 {
  text-align: center;
}

a {
  text-decoration: underline;
}

hr {
  margin-bottom: 3em;
  opacity: 20%;
}

blockquote {
  background-color: #e0f7fa;
}

code {
  background-color: #eee;
  box-shadow: inset 0 0 1em #ddd;
  border-radius: 7px;
  padding-left: 4px;
  padding-right: 4px;
}

pre > code {
  background-color: unset;
  box-shadow: unset;
  border-radius: unset;
  padding-left: unset;
  padding-right: unset;
}
pre {
  padding: 1em;
  background-color: #eeeeee;
  box-shadow: inset 0 0 1em #ddd;
  margin-top: 1em;
  margin-bottom: 1.5em;
  border-radius: 1em;
  overflow: auto;
  overflow-y: overlay;
}

img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1em;
  margin-bottom: 1.5em;
  border-radius: 0.5em;
  max-width: 100%;
}

td,
th {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

table {
  margin-bottom: 1.5em;
}
</style>