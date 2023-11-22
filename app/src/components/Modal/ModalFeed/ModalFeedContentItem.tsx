import { getPreviewComponentEvent } from '@/utils/helpers/prepare-component'
import { StyledItem } from './styled'
import { useEffect, useRef, useState } from 'react'
import { useWindowResize } from './utils'
import { RowProps } from './types'
import { fetchExtendedEventByBech32, getEventNip19, getTagValue, stringToBech32 } from '@/modules/nostr'
import { useAppSelector } from '@/store/hooks/redux'
import { AuthoredEvent } from '@/types/authored-event'

export const ModalFeedContentItem = ({ data, index, setSize }: RowProps) => {
  const rowRef = useRef<HTMLDivElement | null>(null)
  const [event, setEvent] = useState<AuthoredEvent | null>(null)
  const [windowWidth] = useWindowResize()
  const { contactList } = useAppSelector((state) => state.contentWorkSpace)

  useEffect(() => {
    if (rowRef.current && event) {
      setSize(index, rowRef.current.getBoundingClientRect().height)
    }
  }, [setSize, index, windowWidth, event])

  let bech32 = ''
  // eslint-disable-next-line
  // @ts-ignore
  bech32 = data[index].naddr || getEventNip19(data[index])
  // bech32 = getNprofile(data[index].pubkey)
  const b32 = stringToBech32(bech32)

  useEffect(() => {
    const load = async () => {
      const event = await fetchExtendedEventByBech32(b32, contactList?.contactPubkeys)

      setEvent(event)
    }

    load()
  }, [])

  const contentPreviewComponent = event
    ? {
        author: event.author || event,
        pubkey: event.pubkey,
        time: event.created_at,
        kind: event.kind,
        content:
          getTagValue(event, 'summary') ||
          getTagValue(event, 'description') ||
          getTagValue(event, 'alt') ||
          event.content,
        title: getTagValue(event, 'title') || getTagValue(event, 'name')
      }
    : null

  return (
    <>
      {contentPreviewComponent && (
        <div ref={rowRef}>
          <StyledItem>{getPreviewComponentEvent(contentPreviewComponent, { expandMore: false })}</StyledItem>
        </div>
      )}
    </>
  )
}
