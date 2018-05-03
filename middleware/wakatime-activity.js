
const user = process.env.WAKATIME_USER || 'Cuchi'
const interval = Number(process.env.WAKATIME_INTERVAL || 600)

const placeHolderChartData = {
  datasets: [{
    label: 'Languages (%)',
    data: [],
    backgroundColor: []
  }],
  labels: [] }
let activity = placeHolderChartData

if (process.server) {
  const axios = require('axios')
  const { adjust, append, evolve, pathOr, pipe, reduce, take } = require('ramda')
  const blankSlate = { data: { data: { languages: [] } } }
  const url = `https://wakatime.com/api/v1/users/@${user}/stats/last_7_days`

  const updateActivity = async username => {
    const toChartData = pipe(
      pathOr([], ['data', 'data', 'languages']),
      reduce(
        (chartData, { name, percent }) => {
          const c = ((100 - percent) * 2.5).toFixed(0)
          return evolve({
            datasets: adjust(evolve({
              data: append(percent),
              backgroundColor: append(`rgba(${c}, ${c}, ${c}, 1)`) }), 0),
            labels: append(name) }, chartData)
        },
        placeHolderChartData))

    const response = await axios.get(url).catch(() => blankSlate)

    activity = toChartData(response)
  }

  setInterval(updateActivity, interval * 1000)
  updateActivity()
}

export default async context => {
  if (process.server) {
    context.activity = activity
  }
}
