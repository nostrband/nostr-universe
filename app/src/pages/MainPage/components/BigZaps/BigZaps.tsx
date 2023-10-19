import { Container } from '@/layout/Container/Conatiner'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { fetchFollowedZaps, getEventNip19, nostrbandRelay } from '@/modules/nostr'
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

export const BigZaps = memo(function BigZaps() {
  const { handleOpenContextMenu } = useOpenModalSearchParams()
  const { bigZaps, contactList } = useAppSelector((state: RootState) => state.contentWorkSpace)
  const dispatch = useAppDispatch()

  const handleOpenBigZap = useCallback(
    (bigZap: ZapEvent) => {
      let addr = ''
      if (bigZap.targetEvent) {
        addr = getEventNip19(bigZap.targetEvent)
      } else if (bigZap.targetMeta) {
        addr = getEventNip19(bigZap.targetMeta)
        // addr = nip19.neventEncode({
        //   id: bigZap.targetMeta.id,
        //   relays: [nostrbandRelay]
        // })
      } else {
        // eslint-disable-next-line
        // @ts-ignore
        window.plugins.toast.showShortBottom(`Target events not found`)
      }
      console.log('bigZap addr', addr, bigZap)

      handleOpenContextMenu({ bech32: addr })
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

    return <HorizontalSwipeVirtualContent itemHight={73} itemSize={225} itemCount={bigZaps.length} RowComponent={Row} />
  }, [bigZaps, handleReloadBigZaps, handleOpenBigZap])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Big Zaps
        </StyledTitle>
      </Container>
      {renderContent()}
    </StyledWrapper>
  )
})
