/* eslint-disable */
// @ts-nocheck
import { FC, CSSProperties, ReactNode, memo } from 'react'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { StyledItemVitual } from './styled'

interface IVerticalSwipeVirtualContent {
  RowComponent: FC<{ index: number; style: CSSProperties }>
  itemCount: number
  itemHeight: number
  itemSize: number
}

interface IVerticalSwipeVirtualItem {
  style: CSSProperties
  itemCount: number
  index: number
  children: ReactNode
}

export const VerticalSwipeVirtualContent: FC<IVerticalSwipeVirtualContent> = memo(function VerticalSwipeVirtualContent({
  RowComponent,
  itemCount,
  itemSize,
  itemHeight: itemHight
}) {
  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <FixedSizeList
          height={itemHight}
          width={width}
          itemSize={itemSize + 8}
          layout="horizontal"
          itemCount={itemCount}
        >
          {RowComponent}
        </FixedSizeList>
      )}
    </AutoSizer>
  )
})

export const VerticalSwipeVirtualItem: FC<IVerticalSwipeVirtualItem> = memo(function VerticalSwipeVirtualItem({
  style,
  index,
  itemCount,
  children
}) {
  const width = index + 1 === itemCount ? Number(style.width) + 12 : style.width

  return <StyledItemVitual style={{ ...style, width, left: Number(style.left + 12) }}>{children}</StyledItemVitual>
})
