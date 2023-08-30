import { Container } from '@/layout/Container/Conatiner'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { getTagValue, nostrbandRelay } from '@/modules/nostr'
import { useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { LongPost } from '@/types/long-notes'
import { SliderLongPosts } from '@/components/Slider/SliderLongPosts/SliderLongPosts'

export const LongPosts = () => {
  const { handleOpen } = useOpenModalSearchParams(MODAL_PARAMS_KEYS.SELECT_APP)
  const { longPosts } = useAppSelector((state) => state.contentWorkSpace)

  const handleOpenLongPosts = (longPost: LongPost) => {
    const naddr = nip19.naddrEncode({
      pubkey: longPost.pubkey,
      kind: longPost.kind,
      identifier: getTagValue(longPost, 'd'),
      relays: [nostrbandRelay]
    })

    handleOpen({ key: EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP], value: naddr })
  }

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Long posts
        </StyledTitle>
      </Container>

      <SliderLongPosts data={longPosts} isLoading={false} handleClickEntity={handleOpenLongPosts} />
    </StyledWrapper>
  )
}
