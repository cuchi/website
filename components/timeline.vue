<template>
  <div id="timeline-panel" ref="timelinePanel">
    <div id="timeline" ref="timeline" @mousemove="pan">
      <div
        class="timeline-label-wrapper"
        :style="label.style"
        v-for="label in timeLabels"
        :key="label.name"
      >
        <span class="timeline-label">{{ label.name }}</span>
      </div>
      <div
        class="timeline-bar"
        :style="bar.style"
        v-for="bar in timeBars"
        :key="bar.id"
        @mousemove="(event) => showTooltip(event, bar.id)"
      >
        <span>
          {{ bar.title }} - {{ bar.where }}
        </span>
      </div>
    </div>

    <div
      id="tooltip-wrapper"
      ref="tooltipWrapper"
      :style="{ visibility: 'hidden' }"
      @mouseover="pan"
    >
      <TimelineTooltip :contents="currentTooltipEvent" />
    </div>
  </div>
</template>

<script>
import { differenceInDays, getYear, parseISO } from "date-fns";
import { range } from "ramda";
import TimelineTooltip from "./timeline-tooltip";

export default {
  props: {
    events: {
      default: [],
    },
    yearSizeInPx: {
      default: 200,
    },
    horizontalPadding: {
      default: 50,
    },
    currentDate: {
      required: true,
    },
  },

  components: { TimelineTooltip },

  data() {
    return {
      timeBars: [],
      timeLabels: [],
      currentTooltipEvent: null,
    };
  },

  mounted() {
    this.eventsById = this.getEventsById();
    this.years = this.getYears();
    this.timeBars = this.getTimeBars();
    this.width = this.getTimelineWidth();
    this.height = this.getTimelineHeight();
    this.timeLabels = this.getTimeLabels();

    this.isPanning = false;
    this.$refs.timeline.style.width = `${this.width}px`;
    this.$refs.timeline.style.height = `${this.height}px`;
    this.$refs.timelinePanel.scroll(this.width, 0);
  },

  methods: {
    pan(mouseEvent) {
      this.currentTooltipEvent = null;
      this.$refs.tooltipWrapper.style.visibility = "hidden";
      if (mouseEvent.buttons === 1) {
        this.$refs.timelinePanel.scrollBy(-mouseEvent.movementX, 0);
      }
    },

    showTooltip(mouseEvent, id) {
      if (mouseEvent.buttons === 1) {
        return mouseEvent.preventDefault();
      }
      this.currentTooltipEvent = this.eventsById[id];
      this.$refs.tooltipWrapper.style.top = `${mouseEvent.pageY - 20}px`;
      this.$refs.tooltipWrapper.style.left = `${mouseEvent.pageX}px`;
      this.$refs.tooltipWrapper.style.visibility = "visible";
      return mouseEvent.stopPropagation();
    },

    getEventsById() {
      const eventsById = {};
      for (const event of this.events) {
        eventsById[event.id] = event;
      }
      return eventsById;
    },

    getTimelineWidth() {
      return this.yearSizeInPx * this.years.length + this.horizontalPadding * 2;
    },

    getTimelineHeight() {
      return 230;
    },

    getYears() {
      let min;
      for (const event of this.events) {
        const year = getYear(parseISO(event.period.begin));
        if (!min || year < min) {
          min = year;
        }
      }
      const currentYear = getYear(parseISO(this.currentDate));
      return range(min, currentYear + 1);
    },

    getTimeLabels() {
      const firstYear = this.years[0];
      const bottom = "10px";

      const getSize = (year) =>
        this.horizontalPadding + (year - firstYear) * this.yearSizeInPx;

      const yearLabels = this.years.map((year) => ({
        name: year,
        style: {
          bottom,
          left: `${getSize(year)}px`,
        },
      }));

      if (!this.currentDate) {
        return yearLabels;
      }
      const leftSize =
        this.horizontalPadding +
        this.getPxSizeForPeriod(String(firstYear), this.currentDate);
      return [
        ...yearLabels,
        {
          name: "Now",
          style: {
            opacity: 0.7,
            bottom,
            left: `${leftSize}px`,
          },
        },
      ];
    },

    getPxSizeForPeriod(begin, end) {
      const beginDate = parseISO(begin);
      const endDate = parseISO(end);

      return Math.round(
        this.yearSizeInPx *
          (Math.abs(differenceInDays(beginDate, endDate)) / 365)
      );
    },

    getTimeBars() {
      return this.events.map((event) => {
        const left =
          this.horizontalPadding +
          this.getPxSizeForPeriod(String(this.years[0]), event.period.begin);
        const width = this.getPxSizeForPeriod(
          event.period.begin,
          event.period.end || this.currentDate
        );
        const level = event.level || 0;
        return {
          ...event,
          style: {
            backgroundColor: "#CCCCCC",
            top: `${10 * (level + 1) + 50 * level}px`,
            left: `${left}px`,
            width: `${width}px`,
          },
        };
      });
    },
  },
};
</script>

<style scoped>

span {
  
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#timeline-panel {
  overflow-x: scroll;
  overflow-y: visible;
  scrollbar-width: none;
}

#timeline-panel::-webkit-scrollbar {
  display: none;
}

#timeline {
  position: relative;
  touch-action: pan-x;
  -webkit-user-select: none;
  -moz-user-select: none;
  cursor: move;
  min-width: 100%;
}

#tooltip-wrapper {
  position: absolute;
  transform: translateX(-50%) translateY(-100%);
  width: 600px;
}

.timeline-bar {
  position: absolute;
  height: 50px;
  pointer-events: inherit;
  border-radius: 3px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  text-align: center;
  padding-left: 1rem;
  padding-right: 1rem;
}

.timeline-bar:hover {
  filter: brightness(85%);
}

.timeline-label-wrapper {
  position: absolute;
  pointer-events: inherit;
  height: 100%;
  border-right: 2px dotted rgba(0, 0, 0, 0.2);
}

.timeline-label {
  position: absolute;
  padding-left: 5px;
  bottom: 0;
}
</style>