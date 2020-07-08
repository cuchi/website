<template>
  <main class="container col-6 col-lg-8 col-md-10 col-sm-11 pad-top" v-html="post"></main>
</template>

<script>
import axios from 'axios'

const notFoundError = { statusCode: 404, message: 'Post not found' }

export default {
  asyncData: async ({ params, error }) => {
    if (params.post.includes('/')) {
      return error(notFoundError)
    }

    try {
      return { post: require(`~/assets/posts/${params.post}.md`).default }
    } catch {
      return error(notFoundError)
    }
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
}

img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1em;
  margin-bottom: 1.5em;
  border-radius: 0.5em;
}

table {
  margin-bottom: 2em;
}
</style>