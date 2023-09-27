import { Container } from '@/layout/Container/Conatiner'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { fetchFollowedHighlights, nostrbandRelay } from '@/modules/nostr'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { SliderHighlights } from '@/components/Slider/SliderHighlights/SliderHighlights'
import { StyledTitle, StyledWrapper } from './styled'
import { HighlightEvent } from '@/types/highlight-event'
import { setHighlights } from '@/store/reducers/contentWorkspace'
import { memo, useCallback } from 'react'

export const Highlights = memo(() => {
  const { handleOpen } = useOpenModalSearchParams()
  const { highlights, contactList } = useAppSelector((state) => state.contentWorkSpace)
  const dispatch = useAppDispatch()

  const handleOpenHighlight = useCallback((highlight: HighlightEvent) => {
    const nevent = nip19.neventEncode({
      id: highlight.id,
      relays: [nostrbandRelay]
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: nevent } })
  }, [handleOpen])

  const handleReloadHighlights = useCallback(async () => {
    if (contactList) {
      dispatch(setHighlights({ highlights: null }))
      const highlights = await fetchFollowedHighlights(contactList.contactPubkeys).catch(() => {
        dispatch(setHighlights({ highlights: null }))
      })
      dispatch(setHighlights({ highlights }))
    }
  }, [dispatch, contactList])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Highlights
        </StyledTitle>
      </Container>

      <SliderHighlights
        data={highlights || []}
        isLoading={highlights === null}
        handleClickEntity={handleOpenHighlight}
        handleReloadEntity={handleReloadHighlights}
      />
    </StyledWrapper>
  )
})
