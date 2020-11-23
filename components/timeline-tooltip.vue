<template>
  <div v-if="this.contents" id="tooltip">
    <header>
      <div class="header-description">
        <div><strong>{{ this.contents.where }}</strong></div>
        <div>{{ this.contents.title }} - {{ this.contents.type }}</div>
      </div>
      <img v-if="this.contents.logoUrl" :src="this.contents.logoUrl" />
    </header>
    <hr />
    <ul v-for="activity in this.contents.activities" :key="activity">
      <li>{{ activity }}</li>
    </ul>
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

img {
  float: right;
}

header {
  clear: both;
  /* height: 100px; */
}

header:after {
  content: "";
  display: table;
  clear: both;
}

.header-description {
  float: left;
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