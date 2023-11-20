import { Container } from '@/layout/Container/Conatiner'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { fetchFollowedZaps } from '@/modules/nostr'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { ZapEvent } from '@/types/zap-event'
import { setBigZaps } from '@/store/reducers/contentWorkspace'
import { MIN_ZAP_AMOUNT } from '@/consts'
import { memo, useCallback, FC, CSSProperties } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonBigZaps } from '@/components/Skeleton/SkeletonBigZaps/SkeletonBigZaps'
import { ItemBigZap } from '@/components/ItemsContent/ItemBigZap/ItemBigZap'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { RootState } from '@/store/store'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { AugmentedEvent } from '@/types/augmented-event'
import { Chip } from '@mui/material'
import { MODAL_PARAMS_KEYS } from '@/types/modal'

export const BigZaps = memo(function BigZaps() {
  const { handleOpenContextMenu, handleOpen } = useOpenModalSearchParams()
  const { bigZaps, contactList } = useAppSelector((state: RootState) => state.contentWorkSpace)
  const dispatch = useAppDispatch()

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

  const handleReloadBigZaps = useCallback(async () => {
    if (contactList) {
      dispatch(setBigZaps({ bigZaps: null }))
      const bigZaps = await fetchFollowedZaps(contactList.contactPubkeys, MIN_ZAP_AMOUNT).catch(() => {
        dispatch(setBigZaps({ bigZaps: null }))
      })
      dispatch(setBigZaps({ bigZaps }))
    }
  }, [contactList, dispatch])

  const renderContent = useCallback(() => {
    if (bigZaps === null) {
      return (
        <HorizontalSwipeContent childrenWidth={225}>
          <SkeletonBigZaps />
        </HorizontalSwipeContent>
      )
    }

    if (!bigZaps || !bigZaps.length) {
      return <EmptyListMessage onReload={handleReloadBigZaps} />
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
  }, [bigZaps, handleReloadBigZaps, handleOpenBigZap])

  const isVisible = Boolean(bigZaps && bigZaps.length)

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Big Zaps{' '}
          {isVisible && <Chip label="Show more" variant="outlined" size="small" onClick={handleOpenFeedModal} />}
        </StyledTitle>
      </Container>
      {renderContent()}
    </StyledWrapper>
  )
})
