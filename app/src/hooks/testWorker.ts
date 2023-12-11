/* eslint-disable */
// @ts-nocheck
import { wrap } from 'comlink'

const worker = new Worker(new URL('../modules/sync.worker.ts', import.meta.url), {
  type: 'module'
})

export const workerInstance = wrap<typeof import('../modules/sync.worker.ts')>(worker)
