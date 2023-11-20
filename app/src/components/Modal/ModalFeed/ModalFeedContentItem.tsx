import { getPreviewComponentEvent } from '@/utils/helpers/prepare-component'
import { StyledItem } from './styled'
import { useEffect, useRef } from 'react'
import { useWindowResize } from './utils'
import { RowProps } from './types'

export const ModalFeedContentItem = ({ data, index, setSize }: RowProps) => {
  const rowRef = useRef<HTMLDivElement | null>(null)
  const [windowWidth] = useWindowResize()

  useEffect(() => {
    if (rowRef.current) {
      setSize(index, rowRef.current.getBoundingClientRect().height)
    }
  }, [setSize, index, windowWidth])

  return (
    <div ref={rowRef}>
      <StyledItem>{getPreviewComponentEvent(data[index])}</StyledItem>
    </div>
  )
}
