import { postLoader } from './helpers/post-loader'
import { js2xml } from 'xml-js'

const baseUrl = 'https://cuchi.me'
const siteName = 'Cuchi'

const baseRss = {
    _declaration: {
        _attributes: {
            version: '1.0',
            encoding: 'utf-8'
        }
    },
    rss: {
        _attributes: {
            version: '2.0',
            'xmlns:atom': 'http://www.w3.org/2005/Atom'
        },
        channel: {
            title: { _text: siteName },
            language: { _text: 'en-us'},
            link: { _text: `${baseUrl}/rss.xml` },
            'atom:link': { _attributes: {
                href: `${baseUrl}/rss.xml`,
                rel: 'self',
                type: 'application/rss+xml'
            }},
            item: []
        }
    }
}

function buildItem(post) {
    return  {
        title: { _text: post.title },
        guid: { _text: `${baseUrl}/posts/${post.name}` },
        pubDate: { _text: post.createdAt },
    }
}

function RssBuilder() {
    let builtRss
    return function build(posts) {
        if (!builtRss) {
            console.log('foo')
            for (const post of posts) {
                baseRss.rss.channel.item.push(buildItem(post))
            }
            builtRss = baseRss
        }
        return builtRss
    }
}

const buildRss = RssBuilder()

export default async function (req, res) {
    const posts = await postLoader.getAll()
    res.writeHead(200, { 'Content-Type': 'text/xml' })
        .end(js2xml(buildRss(posts), { compact: true }))
}
