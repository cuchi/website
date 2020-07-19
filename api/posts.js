import coreFs from 'fs'
import path from 'path'
import { sortBy, prop } from 'ramda'
import { format } from 'date-fns'

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
        const parsedMeta = JSON.parse(meta)
        return { 
            meta: { 
                ...parsedMeta, 
                formatted: formatDates(parsedMeta)
            }, 
            contents: contents.trim()
        }
    }
}

function formatDates(meta) {
    const formatDate = date => format(new Date(date), 'MMM do, yyyy')
    const formatted = {
        createdAt: formatDate(meta.createdAt)
    }
    if (meta.updatedAt) {
        formatted.updatedAt = formatDate(meta.updatedAt)
    }

    return formatted
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
