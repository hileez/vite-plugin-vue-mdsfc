import MarkdownIt from 'markdown-it'
import { globalOptions } from '@/options'
import { getHashToLetter } from '@/utils/hash'
import { vSFCManager } from '@/vsfc'

/**
 * MarkdownItPlugin: fence to virtual SFC
 * @param md MarkdownIt Instance
 */
export default function markdownitPluginFenceToVSFC(md: MarkdownIt) {
    const $rules = md.renderer.rules
    const originalFence =
        $rules.fence ||
        function (tokens, idx, options, _env, self) {
            return self.renderToken(tokens, idx, options)
        }
    $rules.fence = function (tokens, idx, options, env, self) {
        const token = tokens[idx]
        const language = token.info.trim().toLowerCase()
        const content = token.content.trim()
        if (globalOptions.fenceToSFCLang?.includes(language)) {
            const componentName = getHashToLetter('sha256', content).slice(0, 8)
            const vSFCId = `virtual:${componentName}.vue`
            vSFCManager.set(vSFCId, content) // set VSFC
            return `<${componentName}/>\n`
        }
        return originalFence(tokens, idx, options, env, self)
    }
}
