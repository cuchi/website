<template>
  <main class="container col-6 col-lg-8 col-md-10 col-sm-11 pt-2">
    <a href="/">Home</a> &gt;
    <a href="/posts">Posts</a> &gt;
    <b>{{ title }}</b>

    <p class="article-status">
      Published at {{ createdAtPretty }}
      <br />
      <template v-if="updatedAt">Last updated at {{ updatedAtPretty }}</template>
    </p>

    <article v-html="$md.render(contents)" />
    <hr />
    <footer>
      Paulo Henrique Cuchi
      <a
        alt="CC-BY"
        target="_blank"
        href="https://creativecommons.org/licenses/by/3.0/"
      >
        <img src="~assets/images/cc-by.png" />
      </a>
    </footer>
  </main>
</template>

<script>
import axios from "axios";

export default {
  asyncData: async ({ params, error }) => {
    try {
      const response = await axios.get(
        `${process.env.BASE_URL}/api/posts/${params.post}`
      );
      return response.data;
    } catch (err) {
      return error({ statusCode: 404, message: "Post not found" });
    }
  },

  head() {
    return { title: this.title || "Post" };
  }
};
</script>

<style lang="scss">
.article-status {
  margin-top: 1em;
  font-size: 80%;
  opacity: 0.6;
}

article {
  margin-top: 2em;

  h1 {
    text-align: center;
  }

  hr {
    margin-bottom: 3em;
    opacity: 0.2;
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
}

footer {
  text-align: center;

  img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 1.5em;
    max-width: 100%;
    margin-top: 0.5em;
    width: 10%;
  }
}
</style>