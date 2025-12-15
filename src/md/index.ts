/* VitePlugin: Markdown To SFC */
import type { Plugin } from 'vite'
import { globalOptions } from '@/options'
import markdownit from '@/markdownit'
import { vSFCToImportList } from '@/vsfc'

/* Vite Plugin */
export default function (): Plugin {
    return {
        name: 'vue-mdsfc-plugin',
        enforce: 'pre',
        transform(code, id) {
            // transform module when id matched
            for (const [index, regex] of globalOptions.include.entries()) {
                if (regex.test(id)) break
                if (index === globalOptions.include.length - 1) return code
            }

            // transform befort hook
            if (globalOptions.before) {
                code = globalOptions.before(code, id)
            }

            // markdown render to html, and fence to VSFC
            const mdRenderResult = markdownit.getInstance().render(code)
            // VSFC set to VModule and generate import scripts
            const vSFCimportScript = vSFCToImportList().join('\n')
            let sfc = `<script setup>\n${vSFCimportScript}\n</script>\n<template>\n${mdRenderResult}\n</template>`

            // transform after hook
            if (globalOptions.after) {
                sfc = globalOptions.after(sfc, id)
            }

            return sfc
        },
    }
}
