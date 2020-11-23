
<template>
  <div class="timeline">
    <div class="timeline-item" v-for="event in events" v-bind:key="event.date">
      <div class="timeline-left">
        <a class="icon-lg">
          <span class="material-icons">{{ event.icon }}</span>
        </a>
      </div>
      <div class="timeline-content">
        <span class="label action-label">{{ event.date }}</span><br/>
        {{ event.message }}
      </div>
    </div>
  </div>
</template>

<script>
  export default { props: ['events'] }
</script>

<style lang="scss" scoped>
  @import "~spectre.css/src/spectre-exp";
  $material-icons-font-path: '~material-icons/iconfont/';
  @import '~material-icons/iconfont/material-icons.scss';

  .action-label {
    border-radius: 5px;
  }
</style>
