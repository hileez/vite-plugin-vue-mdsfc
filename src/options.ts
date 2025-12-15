import type { Options as MarkdownitOptions, PluginSimple } from 'markdown-it'
import markdownitPluginFenceToVSFC from '@/markdownit/plugins/fence_to_vsfc'

export interface Options {
    // transform module id regex array.
    include: RegExp[]
    // transform module hook.
    before?: (code: string, id: string) => string
    // transform module hook.
    after?: (code: string, id: string) => string
    // fence to vsfc language.
    fenceToSFCLang?: string[]
    // markdownit options.
    markdownItOptions?: MarkdownitOptions
    // markdownit plugin array.
    markdownItPlugins?: PluginSimple[]
}

const globalOptions: Options = {
    include: [/\.md$/],
    fenceToSFCLang: ['vue'],
    markdownItPlugins: [markdownitPluginFenceToVSFC],
}

export { globalOptions }
