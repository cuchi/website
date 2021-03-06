import { sortBy, prop } from 'ramda'
import { postLoader } from './helpers/post-loader'

export default async function (req, res) {
    const posts = await postLoader.getMappedByName()
    const postName = req.url.replace('/', '')
    if (!postName) {
        const allPosts = Object
            .values(posts)
            .map(post => ({ ...post, contents: undefined }))
        return res.writeHead(200, { 'Content-Type': 'application/json' })
            .end(JSON.stringify(sortBy(prop('createdAt'), allPosts)))
    }

    const post = posts[postName]
    if (!post) {
        return res.writeHead(404).end()
    }

    res.writeHead(200, { 'Content-Type': 'application/json' })
        .end(JSON.stringify(post))
}
