<template>
  <main class="container col-6 col-lg-8 col-md-10 col-sm-11 pt-2">
    <a href="/">Home</a> &gt;
    <b>Posts</b>
    <PostsSection v-bind:posts="posts" />
  </main>
</template>

<script>
import axios from 'axios'
import PostsSection from "~/components/posts-section";

export default {
  components: { PostsSection },

  asyncData: async () => {
    const baseUrl = process.env.baseUrl;
    const posts = await axios.get(`${baseUrl}/api/posts`);
    return { posts: posts.data };
  },

  head() {
    return { title: "Posts" };
  }
};
</script>