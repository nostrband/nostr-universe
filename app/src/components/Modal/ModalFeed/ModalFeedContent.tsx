import { Container } from '@/layout/Container/Conatiner'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { useCallback, useRef, useLayoutEffect, useState } from 'react'
import { VariableSizeList as List } from 'react-window'
import { IEventFeed, ModalFeedContentProps } from './types'
import { ModalFeedContentItem } from './ModalFeedContentItem'

export const ModalFeedContent = ({ dataContent }: ModalFeedContentProps) => {
  const { handleOpenContextMenu } = useOpenModalSearchParams()
  const [heightList, setHeightList] = useState(0)
  const listRef = useRef<List>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sizeMap = useRef<{ [key: number]: number }>({})

  const setSize = useCallback((index: number, size: number) => {
    sizeMap.current = { ...sizeMap.current, [index]: size }
    if (listRef.current) {
      listRef.current.resetAfterIndex(index)
    }
  }, [])

  useLayoutEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.getBoundingClientRect().height
      setHeightList(height)
    }
  }, [])

  if (!dataContent || !dataContent.length) {
    return null
  }

  const getSize = (index: number) => sizeMap.current[index] || 50

  const handleOpenEvent = (event: IEventFeed) => {
    if (!event) {
      // eslint-disable-next-line
      // @ts-ignore
      window.plugins.toast.showShortBottom(`Target events not found`)
    } else {
      console.log('Eevent', event)
      const bech32 = event.naddr || ''
      handleOpenContextMenu({ event, bech32, append: true })
    }
  }

  return (
    <div style={{ height: '100%' }} ref={containerRef}>
      <Container>
        <List
          ref={listRef}
          height={heightList}
          width="100%"
          itemCount={dataContent.length}
          itemSize={getSize}
          itemData={dataContent}
        >
          {({ data, index, style }) => {
            return (
              <div style={style} onClick={() => handleOpenEvent(data[index])}>
                <ModalFeedContentItem data={data} index={index} setSize={setSize} />
              </div>
            )
          }}
        </List>
      </Container>
    </div>
  )
}
