import { wrap, Remote } from 'comlink'
import { WorkerAPI } from './apis'

export let worker: Remote<WorkerAPI>

export function startWorker() {
  if (!window) throw new Error('Only start workers from main thread')

  const rw = new Worker(new URL('./worker', import.meta.url), {
    type: 'module'
  })

  worker = wrap<WorkerAPI>(rw)
}
