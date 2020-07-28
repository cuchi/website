<template>
  <section class="pt-2">
    <h3 class="pt-2">Posts</h3>
    <ul>
      <li v-for="post in posts" v-bind:key="post.name">
        <a :href="`/posts/${post.name}`">{{ post.title }}</a>
        -
        <span class="date-detail">{{ post.createdAtPretty }}</span>
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
  opacity: 0.5;
}
</style>