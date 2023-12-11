import { wrap } from 'comlink'
import { SyncWorkerAPI } from '@/modules/sync.worker.ts'

const worker = new Worker(new URL('../modules/sync.worker.ts', import.meta.url), {
  type: 'module'
})

export const workerInstance = wrap<SyncWorkerAPI>(worker)
