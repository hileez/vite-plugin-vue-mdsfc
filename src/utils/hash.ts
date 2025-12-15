import { createHash } from 'crypto'

/**
 * get string hash(full)
 * @param algorithm 'sha256'|'sha512'|'sha3-256'|'sha3-512'
 * @param content   string
 * @returns hash string
 */
export function getHash(algorithm: string, content: string): string {
    return createHash(algorithm).update(content).digest('hex').toUpperCase()
}

/**
 * get string hash(filter letter)
 * @param algorithm 'sha256'|'sha512'|'sha3-256'|'sha3-512'
 * @param content   string
 * @returns hash string
 */
export function getHashToLetter(algorithm: string, content: string): string {
    return createHash(algorithm)
        .update(content)
        .digest('hex')
        .toUpperCase()
        .replace(/\d/g, '')
}

/**
 * get string hash(filter number)
 * @param algorithm 'sha256'|'sha512'|'sha3-256'|'sha3-512'
 * @param content   string
 * @returns hash string
 */
export function getHashToNumber(algorithm: string, content: string): string {
    return createHash(algorithm)
        .update(content)
        .digest('hex')
        .toUpperCase()
        .replace(/[a-zA-Z]/g, '')
}
