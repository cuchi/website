
<script>
  import { Doughnut } from 'vue-chartjs'

  export default {
    extends: Doughnut,
    props: ['activity'],
    mounted () {
      this.renderChart(this.activity)
    }
  }
</script>
