import axios from 'axios'
import { adjust, append, evolve, pathOr, pipe, reduce } from 'ramda'

const user = process.env.WAKATIME_USER || 'Cuchi'
const interval = Number(process.env.WAKATIME_INTERVAL || 7200)
const url = `https://wakatime.com/api/v1/users/@${user}/stats/last_7_days`

const placeHolderChartData = { datasets: [{ data: [] }], labels: [] }
let activity = placeHolderChartData

async function updateActivity() {
    const toChartData = pipe(
        pathOr([], ['data', 'data', 'languages']),
        reduce(
            (chartData, { name, percent }) =>
                evolve({
                    datasets: adjust(0, evolve({ data: append(percent) })),
                    labels: append(name)
                }, chartData),
            placeHolderChartData))

    try {
        const response = await axios.get(url)
        
        if (response.status !== 200) {
            throw new Error(response.data.message)
        }

        activity = toChartData(response)
    } catch (err) {
        console.error(`Error retrieving WakaTime data: ${err.message}`)
    }
}

setInterval(updateActivity, interval * 1000)
const firstRequest = updateActivity()

export default async function (req, res) {
    await firstRequest
    
    res.writeHead(200, { 'Content-Type': 'application/json' })
        .end(JSON.stringify(activity))
}
