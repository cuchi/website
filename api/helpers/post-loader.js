import coreFs from 'fs'
import path from 'path'
import { format } from 'date-fns'
import markdownIt from 'markdown-it'
import hljs from 'highlight.js'

const markdown = markdownIt({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value
            } catch { }
            return ''
        }
    }
})

const fs = coreFs.promises

const metaSeparator = '---META---'

class PostLoader {
    constructor() {
        this.cachedPosts = {
            all: [],
            byName: {}
        }
        this.isLoaded = false
    }

    async load() {
        const postsDir = await fs.readdir('assets/posts')
        for (const fileName of postsDir) {
            const postName = path.basename(fileName, '.md')
            const post = {
                name: postName,
                ...await this.readPost(fileName)
            }
            this.cachedPosts.all.push(post)
            this.cachedPosts.byName[postName] = post
        }
        this.isLoaded = true
    }

    async getAll() {
        if (this.isLoaded) {
            return this.cachedPosts.all
        }
        await this.load()
        return this.cachedPosts.all
    }

    async getMappedByName() {
        if (this.isLoaded) {
            return this.cachedPosts.byName
        }
        await this.load()
        return this.cachedPosts.byName
    }

    async readPost(fileName) {
        const post = await fs.readFile(`assets/posts/${fileName}`)
        const [meta, contents] = post.toString().split(`${metaSeparator}\n`)
        const parsedMeta = JSON.parse(meta)
        return {
            ...parsedMeta,
            ...this.prettyDates(parsedMeta),
            contents: markdown.render(contents.trim())
        }
    }

    prettyDates(meta) {
        const formatDate = date => format(new Date(date), 'MMM do, yyyy')
        const formatted = {
            createdAtPretty: formatDate(meta.createdAt)
        }
        if (meta.updatedAt) {
            formatted.updatedAtPretty = formatDate(meta.updatedAt)
        }

        return formatted
    }
}

export const postLoader = new PostLoader()
