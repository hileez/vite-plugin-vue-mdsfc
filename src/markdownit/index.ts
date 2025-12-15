import type { Options as MarkdownitOptions, PluginSimple } from 'markdown-it'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

/* MarkdownIt Instance  */
let md: MarkdownIt | null = null

/* MarkdownIt Plugin Store */
class MarkdownItPluginSet extends Set<PluginSimple> {
    add(value: PluginSimple): this {
        super.add(value)
        md = null
        return this
    }
    delete(value: PluginSimple): boolean {
        const result = super.delete(value)
        if (result) md = null
        return result
    }
    clear(): void {
        super.clear()
        md = null
    }
}
const markdownitPluginSet = new MarkdownItPluginSet()

/* Markdownit Options */
const markdownitOptions: MarkdownitOptions = {
    html: false, // enable html
    xhtmlOut: false, // close single tag, <br> to <br/>
    breaks: false, // '\n','\r\n','\r' to <br/>
    langPrefix: 'language-', // <pre class=""> classname prefix.
    linkify: false, // URL to link.
    typographer: false,
    quotes: '“”‘’',
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                // v-pre don't compile
                return `<pre class="hljs" v-pre><code>${
                    hljs.highlight(str, {
                        language: lang,
                        ignoreIllegals: true,
                    }).value
                }</code></pre>`
            } catch {
                // Highlighting failed, fall back to plain escaped text
            }
        }
        return `<pre class="hljs" v-pre><code>${md?.utils.escapeHtml(str)}</code></pre>`
    },
}

/**
 * Set Markdownit Options
 * @param options
 */
function set(options: MarkdownitOptions): void {
    Object.assign(markdownitOptions, options)
    md = null
}

/**
 * Get MarkdownIt Instance
 * @returns MarkdownIt Instance
 */
function getInstance(): MarkdownIt {
    if (!md) {
        md = new MarkdownIt(markdownitOptions)
        for (const plugin of markdownitPluginSet) {
            md.use(plugin)
        }
    }
    return md
}

export default {
    set,
    plugins: markdownitPluginSet,
    getInstance,
}
