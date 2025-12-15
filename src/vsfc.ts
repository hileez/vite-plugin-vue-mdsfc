/*
VSFC Store
@/markdownit/plugins/fence2vsfc.ts write.
@/md/index.ts read.
*/

import { vModuleManager } from '@/vm'

/* Markdown Fence SFC Store */
export const vSFCManager = new Map<string, string>()

/**
 * Fence SFC set to virtual module and generate import list
 * @returns import list
 */
export function vSFCToImportList(): string[] {
    for (const [id, sfc] of vSFCManager) {
        vModuleManager.set(id, sfc)
    }
    const keys = Array.from(vSFCManager.keys())
    vSFCManager.clear()
    return keys.map((id) => `import ${id.slice(8, -4)} from '${id}'`)
}
