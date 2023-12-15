import { Container } from '@/layout/Container/Conatiner'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { ZapEvent } from '@/types/zap-event'
import { selectBigZaps } from '@/store/reducers/contentWorkspace'
import { memo, useCallback, FC, CSSProperties } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonBigZaps } from '@/components/Skeleton/SkeletonBigZaps/SkeletonBigZaps'
import { ItemBigZap } from '@/components/ItemsContent/ItemBigZap/ItemBigZap'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { AugmentedEvent } from '@/types/augmented-event'
import { IconButton } from '@mui/material'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useFeeds } from '@/hooks/feeds'

export const BigZaps = memo(function BigZaps() {
  const { handleOpenContextMenu, handleOpen } = useOpenModalSearchParams()
  const bigZaps = useAppSelector(selectBigZaps)
  const { reloadBigZaps } = useFeeds()

  const handleOpenFeedModal = () => {
    handleOpen(MODAL_PARAMS_KEYS.FEED_MODAL, {
      search: {
        keyData: 'bigZaps'
      }
    })
  }

  const handleOpenBigZap = useCallback(
    (bigZap: ZapEvent) => {
      let event: AugmentedEvent | null = null
      if (bigZap.targetEvent) {
        event = bigZap.targetEvent
      } else if (bigZap.targetMeta) {
        event = bigZap.targetMeta
      }

      if (!event) {
        // eslint-disable-next-line
        // @ts-ignore
        window.plugins.toast.showShortBottom(`Target events not found`)
      } else {
        console.log('bigZap event', event, bigZap)
        handleOpenContextMenu({ event })
      }
    },
    [handleOpenContextMenu]
  )

  const renderContent = useCallback(() => {
    if (bigZaps === null) {
      return (
        <HorizontalSwipeContent childrenWidth={225}>
          <SkeletonBigZaps />
        </HorizontalSwipeContent>
      )
    }

    if (!bigZaps || !bigZaps.length) {
      return <EmptyListMessage onReload={reloadBigZaps} />
    }

    const Row: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const bigZap = bigZaps[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={bigZaps.length}>
          <ItemBigZap
            onClick={() => handleOpenBigZap(bigZap)}
            time={bigZap.created_at}
            subtitle={`+${Math.round(bigZap.amountMsat / 1000)} sats`}
            targetPubkey={bigZap.targetPubkey}
            targetMeta={bigZap.targetMeta}
          />
        </HorizontalSwipeVirtualItem>
      )
    }

    return (
      <HorizontalSwipeVirtualContent itemHeight={73} itemSize={225} itemCount={bigZaps.length} RowComponent={Row} />
    )
  }, [bigZaps, reloadBigZaps, handleOpenBigZap])

  const isVisible = Boolean(bigZaps && bigZaps.length)

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Big Zaps
          {isVisible && (
            <IconButton color="light" size="small" onClick={handleOpenFeedModal}>
              <OpenInFullOutlinedIcon fontSize="inherit" />
            </IconButton>
          )}
        </StyledTitle>
      </Container>
      {renderContent()}
    </StyledWrapper>
  )
})
