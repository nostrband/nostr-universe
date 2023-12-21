import { useState } from 'react'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalSelectAppContent } from './ModalSelectAppContent'
import { kindNames } from '@/consts'
import { useAppSelector } from '@/store/hooks/redux.ts'
import { getSlug } from '@/utils/helpers/general.ts'

export const ModalSelectApp = () => {
  const [kind, setKind] = useState('')
  const { handleClose } = useOpenModalSearchParams()
  const { isOpen, slug } = useAppSelector((state) => getSlug(state.router.slugs, MODAL_PARAMS_KEYS.SELECT_APP))

  const handleSetKind = (k: string) => {
    setKind(k)
  }

  let label = 'Select app'
  if (kind) {
    const name = kindNames[kind]
    if (name) label = `App for ${name} (${kind})`
    else label = `App for kind ${kind}`
  }

  return (
    <Modal title={label} open={isOpen} handleClose={() => handleClose()}>
      {isOpen && <ModalSelectAppContent slug={slug} handleSetKind={handleSetKind} />}
    </Modal>
  )
}
