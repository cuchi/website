
<script>
  import { Doughnut } from 'vue-chartjs'
  import pattern from 'patternomaly'

  export default {
    extends: Doughnut,
    props: ['activity'],
    mounted () {
      const data = this.activity.datasets[0].data
      const backgroundColor = pattern
        .generate(data.map(value => {
          const c = ((100 - value) * 2).toFixed(0)
          return `rgba(${c}, ${c}, ${c}, 1)`
        }))

      this.activity.datasets[0].backgroundColor = backgroundColor

      this.renderChart(this.activity, { legend: { position: 'bottom' } })
    }
  }
</script>
