import { getPreviewComponentEvent } from '@/utils/helpers/prepare-component'
import { StyledItem } from './styled'
import { useEffect, useRef } from 'react'
import { useWindowResize } from './utils'
import { RowProps } from './types'
import { getTagValue } from '@/modules/nostr'

export const ModalFeedContentItem = ({ data, index, setSize }: RowProps) => {
  const rowRef = useRef<HTMLDivElement | null>(null)
  const [windowWidth] = useWindowResize()

  useEffect(() => {
    if (rowRef.current) {
      setSize(index, rowRef.current.getBoundingClientRect().height)
    }
  }, [setSize, index, windowWidth])

  const contentPreviewComponent = {
    author: data[index].author || data[index],
    pubkey: data[index].pubkey,
    time: data[index].created_at,
    kind: data[index].kind,
    content:
      getTagValue(data[index], 'summary') ||
      getTagValue(data[index], 'description') ||
      getTagValue(data[index], 'alt') ||
      data[index].content,
    title: getTagValue(data[index], 'title') || getTagValue(data[index], 'name'),
    post: data[index].post
  }

  return (
    <>
      {contentPreviewComponent && (
        <div ref={rowRef}>
          <StyledItem>
            {getPreviewComponentEvent(contentPreviewComponent, { expandMore: false, isOpenLink: false })}
          </StyledItem>
        </div>
      )}
    </>
  )
}
