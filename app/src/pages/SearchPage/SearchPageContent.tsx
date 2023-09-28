import React, { FC, useCallback, useEffect, useState } from 'react'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { useOpenApp } from '@/hooks/open-entity'
import {
  getTagValue,
  nostrbandRelay,
  searchLongNotes,
  searchNotes,
  searchProfiles,
  stringToBech32
} from '@/modules/nostr'
import { AuthoredEvent } from '@/types/authored-event'
import { LongNoteEvent } from '@/types/long-note-event'
import { MetaEvent } from '@/types/meta-event'
import { EXTRA_OPTIONS, MODAL_PARAMS_KEYS } from '@/types/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { Container } from '@/layout/Container/Conatiner'
import { StyledTitle, StyledWrapper } from '@/pages/MainPage/components/SuggestedProfiles/styled'
import { StyledTitle as StyledTitleNotes } from '@/pages/MainPage/components/TrendingNotes/styled'
import { StyledTitle as StyledTitleLongPost } from '@/pages/MainPage/components/LongPosts/styled'
import { SliderProfiles } from '@/components/Slider/SliderProfiles/SliderProfiles'
import { SliderTrendingNotes } from '@/components/Slider/SliderTrendingNotes/SliderTrendingNotes'
import { SliderLongNotes } from '@/components/Slider/SliderLongNotes/SliderLongNotes'
import { LoadingContainer, LoadingSpinner } from '@/shared/LoadingSpinner/LoadingSpinner'
import { StyledForm, StyledInput } from './styled'
import { IconButton } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { ContactList } from '../MainPage/components/ContactList/ContactList'

type Props = {
  searchValueRef: React.MutableRefObject<string>
}

export const SearchPageContent: FC<Props> = ({ searchValueRef }) => {
  const { openBlank } = useOpenApp()
  const [searchValue, setSearchValue] = useState('')
  const [profiles, setProfiles] = useState<MetaEvent[] | null>(null)
  const [notes, setNotes] = useState<AuthoredEvent[] | null>(null)
  const [longNotes, setLongNotes] = useState<LongNoteEvent[] | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const { handleOpen } = useOpenModalSearchParams()

  const onSearch = (str: string): boolean => {
    try {
      const url = new URL('/', str)
      if (url) {
        openBlank({ url: str }, {})
        return true
      }
    } catch (err) {
      console.log(err)
    }

    const b32 = stringToBech32(str)

    if (b32) {
      handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: b32 } })
      return true
    }

    return false
  }

  const loadEvents = useCallback(async (searchValue: string) => {
    setIsLoading(true)
    searchProfiles(searchValue)
      .then((data) => {
        setProfiles(data)
      })
      .then(() => searchNotes(searchValue))
      .then((data) => {
        setNotes(data)
      })
      .then(() => searchLongNotes(searchValue))
      .then((data) => {
        setLongNotes(data)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    searchValueRef.current = searchValue
    onSearch(searchValue)
    loadEvents(searchValue)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleOpenProfile = (profile: MetaEvent) => {
    const nprofile = nip19.nprofileEncode({
      pubkey: profile.pubkey,
      relays: [nostrbandRelay]
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: nprofile } })
  }

  const handleOpenNote = (note: AuthoredEvent) => {
    const nevent = nip19.neventEncode({
      relays: [nostrbandRelay],
      id: note.id
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: nevent } })
  }

  const handleOpenLongNote = (longNote: LongNoteEvent) => {
    const naddr = nip19.naddrEncode({
      pubkey: longNote.pubkey,
      kind: longNote.kind,
      identifier: getTagValue(longNote, 'd'),
      relays: [nostrbandRelay]
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: naddr } })
  }

  // useEffect(() => {
  //   return () => {
  //     setSearchValue('')
  //     setProfiles(null)
  //     setNotes(null)
  //     setLongNotes(null)
  //   }
  // }, [isOpen])

  useEffect(() => {
    const memoizedSearchValue = searchValueRef.current
    setSearchValue(memoizedSearchValue)
    if (memoizedSearchValue.trim().length) {
      loadEvents(memoizedSearchValue)
    }
  }, [searchValueRef, loadEvents])

  const renderContent = () => {
    return (
      <>
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

            <SliderLongNotes data={longNotes} isLoading={false} handleClickEntity={handleOpenLongNote} />
          </StyledWrapper>
        )}
        {isLoading && (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        )}
      </>
    )
  }

  return (
    <>
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

      {renderContent()}
    </>
  )
}
