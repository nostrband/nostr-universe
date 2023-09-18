export interface IPermReq {
  id: string
  tabId: string
  cb: () => void
  perm?: string
  event?: string
  plainText?: string
  pubkey?: string
  cipherText?: string
  paymentRequest?: string
  amount?: number
  wallet?: {
    [key: string]: string
  }
}

export interface IPerm {
  pubkey: string
  app: string
  name: string
  value: string
}
