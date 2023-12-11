import { expose } from 'comlink'
import {blockingFunc} from "@/modules/testSync.ts";

const api = {
  someMethod(p: string) {
    console.log('PUB!!!!!!!!!!!!!!!!!!!!!!!!', p)
    blockingFunc()
  }
}

expose(api)
