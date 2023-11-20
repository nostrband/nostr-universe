import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalFeedContent } from './ModalFeedContent'
import { useSearchParams } from 'react-router-dom'
import { IContentWorkSpace } from '@/store/reducers/contentWorkspace'
import { useAppSelector } from '@/store/hooks/redux'
import { ReturnDataContent } from './types'

export const ModalFeed = () => {
  const { handleClose, getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.FEED_MODAL)
  const data = useAppSelector((state) => state.contentWorkSpace)
  const [searchParams] = useSearchParams()

  const keyData = (searchParams.get('keyData') || '') as keyof IContentWorkSpace

  const TITLES_FEED: Record<string, string> = {
    highlights: 'Highlights',
    bigZaps: 'Big Zaps'
  }

  const label = TITLES_FEED[keyData]

  const getDataContent = (key: string): ReturnDataContent => {
    switch (key) {
      case 'highlights':
        if (!data.highlights) {
          return []
        }

        return data.highlights

      case 'bigZaps':
        if (!data.bigZaps) {
          return []
        }

        return data.bigZaps.map((el) => {
          const event = el.targetEvent || el.targetMeta || el

          return event
        })

      default:
        return []
    }
  }

  const dataContent = getDataContent(keyData)

  return (
    <Modal title={label} open={isOpen} handleClose={() => handleClose()}>
      {isOpen && dataContent && <ModalFeedContent dataContent={dataContent} />}
    </Modal>
  )
}
