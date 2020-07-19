import { T, always, both, complement, cond, last, map, propEq, reduceWhile } from 'ramda'
import axios from 'axios'
import { format } from 'date-fns'

const user = process.env.GITHUB_USER || 'cuchi'
const many = Number(process.env.GITHUB_MANY_EVENTS || 7)
const interval = Number(process.env.GITHUB_INTERVAL || 1800)

let events = []

const url = `https://api.github.com/users/${user}/events`
const typeEq = propEq('type')
const formatEventDate = e =>
    format(new Date(e.created_at), 'MMM do, yyyy - HH:mm')

const eventTypes = [{
    trigger: typeEq('WatchEvent'),
    icon: 'star',
    getMessage: e => `starred ${e.repo.name}`
}, {
    trigger: typeEq('PushEvent'),
    icon: 'file_upload',
    getMessage: e => `pushed updates to ${e.repo.name}`
}, {
    trigger: both(typeEq('IssuesEvent'), propEq('action', 'opened')),
    icon: 'info',
    getMessage: e => `opened an issue on ${e.repo.name}`
}]

const getEventInfo = cond(
    [...map(
        ({ trigger, icon, getMessage }) =>
            [trigger, e =>
                ({ icon, message: getMessage(e), date: formatEventDate(e) })],
        eventTypes),
    [T, always(null)]])

async function updateLastEvents() {
    try {
        events = reduceWhile(
            complement(propEq('length', many)),
            (eventsAcc, rawEvent) => {
                const event = getEventInfo(rawEvent)
                const lastEvent = last(eventsAcc) || {}
                return event && event.message !== lastEvent.message
                    ? [...eventsAcc, event]
                    : eventsAcc
            },
            [],
            (await axios.get(url)).data)
    } catch (err) {
        console.error(`Error retrieving GitHub data: ${err.message}`)
    }
}

setInterval(updateLastEvents, interval * 1000)
const firstRequest = updateLastEvents()

export default async function (req, res) {
    await firstRequest
    
    res.writeHead(200, { 'Content-Type': 'application/json' })
        .end(JSON.stringify(events))
}
