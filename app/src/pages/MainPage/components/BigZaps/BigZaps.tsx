import { Container } from '@/layout/Container/Conatiner'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { fetchFollowedZaps, nostrbandRelay } from '@/modules/nostr'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { ZapEvent } from '@/types/zap-event'
import { setBigZaps } from '@/store/reducers/contentWorkspace'
import { MIN_ZAP_AMOUNT } from '@/consts'
import { memo, useCallback } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonBigZaps } from '@/components/Skeleton/SkeletonBigZaps/SkeletonBigZaps'
import { ItemBigZap } from '@/components/ItemsContent/ItemBigZap/ItemBigZap'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'

export const BigZaps = memo(function BigZaps() {
  const { handleOpen } = useOpenModalSearchParams()
  const { bigZaps, contactList } = useAppSelector((state) => state.contentWorkSpace)
  const dispatch = useAppDispatch()

  const handleOpenBigZap = useCallback(
    (bigZap: ZapEvent) => {
      let addr = ''
      if (bigZap.targetEvent) {
        if (bigZap.targetEvent.kind === 0) {
          addr = nip19.nprofileEncode({
            pubkey: bigZap.targetEvent.pubkey,
            relays: [nostrbandRelay]
          })
        } else if (
          (bigZap.targetEvent.kind >= 10000 && bigZap.targetEvent.kind < 20000) ||
          (bigZap.targetEvent.kind >= 30000 && bigZap.targetEvent.kind < 40000)
        ) {
          addr = nip19.naddrEncode({
            pubkey: bigZap.targetEvent.pubkey,
            kind: bigZap.targetEvent.kind,
            identifier: bigZap.targetEvent.identifier,
            relays: [nostrbandRelay]
          })
        } else if (bigZap.targetMeta) {
          addr = nip19.neventEncode({
            id: bigZap.targetMeta.id,
            relays: [nostrbandRelay]
          })
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.plugins.toast.showShortBottom(`Target events not found`)
        }
      }

      handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, {
        search: {
          [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: addr,
          [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.KIND]]: String(bigZap.targetEvent?.kind || bigZap.kind)
        }
      })
    },
    [handleOpen]
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

  const renderContent = () => {
    if (bigZaps === null) {
      return <SkeletonBigZaps />
    }
    if (!bigZaps || !bigZaps.length) {
      return <EmptyListMessage onReload={handleReloadBigZaps} />
    }
    return bigZaps.map((bigZap, i) => (
      <ItemBigZap
        key={i}
        onClick={() => handleOpenBigZap(bigZap)}
        time={bigZap.created_at}
        subtitle={`+${Math.round(bigZap.amountMsat / 1000)} sats`}
        targetPubkey={bigZap.targetPubkey}
        targetMeta={bigZap.targetMeta}
      />
    ))
  }

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Big Zaps
        </StyledTitle>
      </Container>

      <HorizontalSwipeContent childrenWidth={225}>{renderContent()}</HorizontalSwipeContent>
    </StyledWrapper>
  )
})
