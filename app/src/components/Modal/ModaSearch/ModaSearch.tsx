/* eslint-disable */
// @ts-nocheck
import { useState, useEffect } from 'react'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Modal } from '@/modules/Modal/Modal'
import { Container } from '@/layout/Container/Conatiner'
import { IconButton } from '@mui/material'
import { getTagValue, nostrbandRelay, searchLongNotes, searchNotes, searchProfiles } from '@/modules/nostr'
import { StyledForm, StyledInput } from './styled'
import { ContactList } from '@/containers/MainContainer/components/ContactList/ContactList'
import { SliderProfiles } from '@/components/Slider/SliderProfiles/SliderProfiles'
import { StyledTitle, StyledWrapper } from '@/containers/MainContainer/components/SuggestedProfiles/styled'
import { StyledTitle as StyledTitleNotes } from '@/containers/MainContainer/components/TrendingNotes/styled'
import { StyledTitle as StyledTitleLongPost } from '@/containers/MainContainer/components/LongPosts/styled'
import { getNpub } from '@/utils/helpers/prepare-data'
import { nip19 } from '@nostrband/nostr-tools'
import { TrendingProfile } from '@/types/trending-profiles'
import { SliderTrendingNotes } from '@/components/Slider/SliderTrendingNotes/SliderTrendingNotes'
import { SliderLongPosts } from '@/components/Slider/SliderLongPosts/SliderLongPosts'

export const ModaSearch = () => {
  const [searchValue, setSearchValue] = useState('')
  const [profiles, setProfiles] = useState(null)
  const [notes, setNotes] = useState(null)
  const [longNotes, setLongNotes] = useState(null)

  const { handleClose, getModalOpened, handleOpen } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.SEARCH_MODAL)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    searchProfiles(searchValue)
      .then((data) => {
        const prepareProfiles = data.map((el) => ({
          ...JSON.parse(el.content),
          npub: getNpub(el.pubkey),
          pubkey: el.pubkey
        }))

        setProfiles(prepareProfiles)
      })
      .then(() => searchNotes(searchValue))
      .then((data) => {
        const prepareNotes = data.map((el) => ({
          ...el,
          author: {
            ...el.author,
            npub: getNpub(el.pubkey),
            pubkey: el.pubkey,
            profile: JSON.parse(el.author.content)
          }
        }))

        setNotes(prepareNotes)
      })
      .then(() => searchLongNotes(searchValue))
      .then((data) => {
        const prepareLongPosts = data.map((el) => ({
          ...el,
          author: {
            ...el.author,
            npub: getNpub(el.pubkey),
            pubkey: el.pubkey,
            profile: JSON.parse(el.author.content)
          }
        }))
        setLongNotes(prepareLongPosts)
      })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleOpenProfile = (profile: TrendingProfile) => {
    const nprofile = nip19.nprofileEncode({
      pubkey: profile.pubkey,
      relays: [nostrbandRelay]
    })

    handleOpen(MODAL_PARAMS_KEYS.SEARCH_MODAL, { key: EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP], value: nprofile })
  }

  const handleOpenNote = (note) => {
    const nprofile = nip19.nprofileEncode({
      pubkey: note.pubkey,
      relays: [nostrbandRelay]
    })

    handleOpen(MODAL_PARAMS_KEYS.SEARCH_MODAL, { key: EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP], value: nprofile })
  }

  const handleOpenLongPost = (longPost) => {
    const naddr = nip19.naddrEncode({
      pubkey: longPost.pubkey,
      kind: longPost.kind,
      identifier: getTagValue(longPost, 'd'),
      relays: [nostrbandRelay]
    })

    handleOpen(MODAL_PARAMS_KEYS.SEARCH_MODAL, { key: EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP], value: naddr })
  }

  useEffect(() => {
    setSearchValue('')
    setProfiles(null)
    setNotes(null)
    setLongNotes(null)
  }, [open])

  return (
    <Modal title="Search" open={isOpen} handleClose={handleClose}>
      <Container>
        <StyledForm onSubmit={handleSubmit}>
          <StyledInput
            placeholder="Search"
            endAdornment={
              <IconButton type="submit" color="inherit" size="medium">
                <SearchOutlinedIcon />
              </IconButton>
            }
            onChange={handleChange}
            value={searchValue}
            inputProps={{
              autoFocus: true
            }}
          />
        </StyledForm>
      </Container>

      {!searchValue && <ContactList />}

      {profiles && (
        <StyledWrapper>
          <Container>
            <StyledTitle variant="h5" gutterBottom component="div">
              Profiles
            </StyledTitle>
          </Container>

          <SliderProfiles data={profiles} isLoading={false} handleClickEntity={handleOpenProfile} />
        </StyledWrapper>
      )}

      {notes && (
        <StyledWrapper>
          <Container>
            <StyledTitleNotes variant="h5" gutterBottom component="div">
              Notes
            </StyledTitleNotes>
          </Container>

          <SliderTrendingNotes data={notes} isLoading={false} handleClickEntity={handleOpenNote} />
        </StyledWrapper>
      )}

      {longNotes && (
        <StyledWrapper>
          <Container>
            <StyledTitleLongPost variant="h5" gutterBottom component="div">
              Long posts
            </StyledTitleLongPost>
          </Container>

          <SliderLongPosts data={longNotes} isLoading={false} handleClickEntity={handleOpenLongPost} />
        </StyledWrapper>
      )}
    </Modal>
  )
}
