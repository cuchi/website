<template>
  <div v-if="this.contents" id="tooltip">
    <div>{{ this.contents.type }}</div>
    <div>{{ this.contents.where }}</div>
    <hr />
    <div>{{ this.contents.title }}</div>
    <div><strong>{{ this.contents.where }}</strong></div>
  </div>
</template>

<script>
export default {
  props: ["contents"],
};
</script>

<style scoped>
hr {
  border: 1px dashed;
  opacity: 0.5;
  margin-bottom: 1rem;
}

#tooltip {
  border-left: 5px solid indigo;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  padding: 1em;
  -webkit-box-shadow: 0px 0px 40px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 0px 0px 40px 10px rgba(0, 0, 0, 0.4);
}
</style>