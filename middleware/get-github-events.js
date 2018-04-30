
let cache, getLastEvents

if (process.server) {
  const { promisifyAll } = require('bluebird')
  const { T, always, both, complement, cond, map,
    prop, propEq, reduceWhile } = require('ramda')
  const NodeCache = require('node-cache')
  const axios = require('axios').default
  const { format } = require('date-fns')

  const typeEq = propEq('type')

  const formatEventDate = e =>
    format(new Date(e.created_at), 'MMM Do, YYYY - HH:mm')

  const events = [{
    trigger: typeEq('WatchEvent'),
    icon: 'star',
    getMessage: e => `starred ${e.repo.name}`
  },{
    trigger: typeEq('PushEvent'),
    icon: 'file upload',
    getMessage: e => `starred ${e.repo.name}`
  },{
    trigger: both(typeEq('IssuesEvent'), propEq('action', 'opened')),
    icon: 'info',
    getMessage: e => `opened an issue on ${e.repo.name}`
  }]

  const getEventInfo = cond(
    [...map(
      ({ trigger, icon, getMessage }) =>
        [trigger, e =>
          ({ icon, message: getMessage(e), date: formatEventDate(e) })],
      events),
    [T, always(null)]])

  getLastEvents = async (name, many) => {
    const url = `https://api.github.com/users/${name}/events`

    return reduceWhile(
      complement(propEq('length', many)),
      (events, rawEvent) => {
        const event = getEventInfo(rawEvent)
        return event ? [...events, event] : events
      },
      [],
      (await axios.get(url)).data)
  }

  cache = promisifyAll(new NodeCache())
}

export default async context => {
  if (process.server) {
    let events = await cache.getAsync('events')

    if (!events) {
      console.log('Fetching events...')
      events = await getLastEvents('cuchi', 5)
      console.log('Caching...')
      await cache.setAsync('events', events, 600)
    }

    context.events = events
  }
}
