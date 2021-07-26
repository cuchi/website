<template>
  <div v-if="this.contents" id="tooltip">
    <header>
      <div class="header-description">
        <div>
          <strong>{{ this.contents.where }}</strong>
        </div>
        <div>{{ this.contents.title }} - {{ this.contents.type }}</div>
        <div class="time-period">
          {{ this.getFormattedPeriod() }}
          <span class="time-duration">({{ this.getDuration() }})</span>
        </div>
      </div>
      <img v-if="this.contents.logoUrl" :src="this.contents.logoUrl" />
    </header>
    <hr v-if="this.hasActivities()" />
    <ul v-for="activity in this.contents.activities" :key="activity">
      <li>{{ activity }}</li>
    </ul>
  </div>
</template>

<script>
import { intervalToDuration, formatDuration } from "date-fns";

export default {
  props: ["contents"],

  methods: {
    hasActivities() {
      return this.contents.activities && this.contents.activities.length;
    },

    formatDate(dateString) {
      return dateString.replace(/-/g, "/");
    },

    getFormattedPeriod() {
      const { begin, end } = this.contents.period;

      return `${this.formatDate(begin)} - ${this.formatDate(end || "Ongoing")}`;
    },

    getDuration() {
      const { begin, end } = this.contents.period;
      const duration = intervalToDuration({
        start: new Date(begin),
        end: end ? new Date(end) : new Date(),
      });
      return formatDuration(duration, { format: ['years', 'months'] });
    },
  },
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

.time-period {
  font-size: 12px;
}

.time-duration {
  opacity: 0.6;
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