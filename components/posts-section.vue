<template>
  <section class="pt-2">
    <h2 class="pt-2">Posts</h2>
    <ul>
      <li v-for="post in posts" v-bind:key="post.name">
        <a :href="`/posts/${post.name}`">{{ post.title }}</a>
        -
        <span class="date-detail">{{ post.createdAt }}</span>
      </li>
    </ul>
  </section>
</template>

<script>
export default { props: ["posts"] };
</script>

<style lang="scss" scoped>
.date-detail {
  text-decoration: none;
  opacity: 50%;
}
</style>