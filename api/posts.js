import coreFs from 'fs'
import path from 'path'
import { sortBy, prop } from 'ramda'

const fs = coreFs.promises

const metaSeparator = '---META---'

class PostLoader {
    constructor() {
        this.cachedPosts = {}
        this.isLoaded = false
    }

    async load() {
        if (this.isLoaded) {
            return this.cachedPosts
        }

        const postsDir = await fs.readdir('assets/posts')
        for (const fileName of postsDir) {
            const postName = path.basename(fileName, '.md')
            this.cachedPosts[postName] = await this.getPost(fileName)
        }
        this.isLoaded = true
        return this.cachedPosts
    }

    async getPost(fileName) {
        const post = await fs.readFile(`assets/posts/${fileName}`)
        const [meta, contents] = post.toString().split(`${metaSeparator}\n`)
        return { meta: JSON.parse(meta), contents: contents.trim() }
    }
}

const postLoader = new PostLoader()

export default async function (req, res) {
    const posts = await postLoader.load()
    const postName = req.url.replace('/', '')
    if (!postName) {
        const allPosts = []
        for (const [name, { meta }] of Object.entries(posts)) {
            allPosts.push({ ...meta, name })
        }
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
