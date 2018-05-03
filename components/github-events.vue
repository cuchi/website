
<template>
  <div class="timeline">
    <div class="timeline-item" v-for="event in events">
      <div class="timeline-left">
        <a class="icon-lg">
          <span class="material-icons">{{ event.icon }}</span>
        </a>
      </div>
      <div class="timeline-content">
        <span class="label">{{ event.date }}</span><br/>
        {{ event.message }}
      </div>
    </div>
    <a target="_blank" href="https://github.com/cuchi">Follow me :)</a>
  </div>
</template>

<script>
  export default { props: ['events'] }
</script>

<style lang="scss">
  @import "~spectre.css/src/spectre-exp";
  $material-icons-font-path: '~material-icons/iconfont/';
  @import '~material-icons/iconfont/material-icons.scss';
</style>
