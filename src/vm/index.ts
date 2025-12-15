/* VitePlugin: VirtualModule */
import type { Plugin } from 'vite'

/* Virtual Module Manager */
export const vModuleManager = new Map<string, string>()

/* Vite Plugin */
export default function (): Plugin {
    return {
        name: 'virtual-module-plugin',
        enforce: 'pre',
        // Reset moduleId when resolve moduleId
        resolveId(id: string): string | void {
            if (vModuleManager.has(id)) {
                return id
            }
        },
        // Return module content when load module
        load(id: string): string | void {
            if (vModuleManager.has(id)) {
                return vModuleManager.get(id)
            }
        },
    }
}
