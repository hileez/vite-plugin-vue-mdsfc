export type { Options } from '@/options'
export { default as markdownitPluginFenceToVSFC } from '@/markdownit/plugins/fence_to_vsfc'
import type { Plugin } from 'vite'
import type { Options } from '@/options'
import { globalOptions } from '@/options'
import markdownit from '@/markdownit'
import md from '@/md'
import vm from '@/vm'

export default function (options?: Options): Plugin[] {
    /* set global options */
    Object.assign(globalOptions, options)

    /* set markdownit options */
    if (globalOptions.markdownItOptions) {
        markdownit.set(globalOptions.markdownItOptions)
    }

    /* add markdownit plugin */
    if (globalOptions.markdownItPlugins) {
        markdownit.plugins.clear()
        for (const markdownItPlugin of globalOptions.markdownItPlugins) {
            markdownit.plugins.add(markdownItPlugin)
        }
    }

    return [md(), vm()]
}
