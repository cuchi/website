
const user = process.env.WAKATIME_USER || 'Cuchi'
const interval = Number(process.env.WAKATIME_INTERVAL || 7200)

const placeHolderChartData = { datasets: [{ data: [] }], labels: [] }
let activity = placeHolderChartData

if (process.server) {
  const axios = require('axios')
  const { adjust, append, evolve, pathOr, pipe, reduce, take } = require('ramda')
  const blankSlate = { data: { data: { languages: [] } } }
  const url = `https://wakatime.com/api/v1/users/@${user}/stats/last_7_days`

  const updateActivity = async () => {
    const toChartData = pipe(
      pathOr([], ['data', 'data', 'languages']),
      reduce(
        (chartData, { name, percent }) =>
          evolve({
            datasets: adjust(evolve({ data: append(percent) }), 0),
            labels: append(name) }, chartData),
        placeHolderChartData))

    try {
      const response = await axios.get(url)
      if (response.status !== 200) {
        throw new Error(response.data.message)
      }

      activity = toChartData(response)
    } catch (err) {
      console.log(`Error retrieving WakaTime data: ${err.message}`)
    }
  }

  setInterval(updateActivity, interval * 1000)
  updateActivity()
}

export default async context => {
  if (process.server) {
    context.activity = activity
  }
}
