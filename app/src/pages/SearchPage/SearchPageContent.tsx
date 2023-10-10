import React, { useCallback, useEffect, useState } from 'react'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { useOpenApp } from '@/hooks/open-entity'
import {
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
import { LoadingContainer, LoadingSpinner } from '@/shared/LoadingSpinner/LoadingSpinner'
import { StyledForm, StyledInput } from './styled'
import { IconButton } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { ContactList } from '../MainPage/components/ContactList/ContactList'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setSearchValue } from '@/store/reducers/searchModal.slice'
import { useSearchParams } from 'react-router-dom'
import { StyledWrapVisibility } from '../styled'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { ItemTrendingNote } from '@/components/ItemsContent/ItemTrendingNote/ItemTrendingNote'
import { Profile } from '@/shared/Profile/Profile'
import { ItemLongNote } from '@/components/ItemsContent/ItemLongNote/ItemLongNote'

export const SearchPageContent = () => {
  const [searchParams] = useSearchParams()
  const isShow = searchParams.get('page') === 'search'

  const { openBlank } = useOpenApp()
  const { searchValue } = useAppSelector((state) => state.searchModal)
  const dispatch = useAppDispatch()
  // const [searchValue, setSearchValue] = useState('')
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
      handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { 
        [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: b32
      } })
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
    localStorage.setItem('searchValue', searchValue)
    onSearch(searchValue)
    loadEvents(searchValue)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchValue({ searchValue: e.target.value }))
  }

  const handleOpenProfile = (profile: MetaEvent) => {
    const nprofile = nip19.nprofileEncode({
      pubkey: profile.pubkey,
      relays: [nostrbandRelay]
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { 
      [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: nprofile,
      [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.KIND]]: String(0)
    } })
  }

  const handleOpenNote = (note: AuthoredEvent) => {
    const nevent = nip19.neventEncode({
      relays: [nostrbandRelay],
      id: note.id
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { 
      [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: nevent,
      [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.KIND]]: String(note.kind)
    } })
  }

  const handleOpenLongNote = (longNote: LongNoteEvent) => {
    const naddr = nip19.naddrEncode({
      pubkey: longNote.pubkey,
      kind: longNote.kind,
      identifier: longNote.identifier,
      relays: [nostrbandRelay]
    })

    handleOpen(MODAL_PARAMS_KEYS.SELECT_APP, { search: { 
      [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.SELECT_APP]]: naddr,
      [EXTRA_OPTIONS[MODAL_PARAMS_KEYS.KIND]]: String(longNote.kind)
    } })
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
    if (searchValue.trim().length) {
      loadEvents(searchValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadEvents])

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

            <HorizontalSwipeContent childrenWidth={140}>
              {profiles.map((profile, i) => (
                <Profile key={i} onClick={handleOpenProfile} profile={profile} />
              ))}
            </HorizontalSwipeContent>
          </StyledWrapper>
        )}

        {notes && (
          <StyledWrapper>
            <Container>
              <StyledTitleNotes variant="h5" gutterBottom component="div">
                Notes
              </StyledTitleNotes>
            </Container>

            <HorizontalSwipeContent childrenWidth={225}>
              {notes.map((note, i) => (
                <ItemTrendingNote
                  onClick={() => handleOpenNote(note)}
                  key={i}
                  time={note.created_at}
                  content={note.content}
                  pubkey={note.pubkey}
                  author={note.author}
                />
              ))}
            </HorizontalSwipeContent>
          </StyledWrapper>
        )}

        {longNotes && (
          <StyledWrapper>
            <Container>
              <StyledTitleLongPost variant="h5" gutterBottom component="div">
                Long posts
              </StyledTitleLongPost>
            </Container>

            <HorizontalSwipeContent childrenWidth={225}>
              {longNotes.map((longNote, i) => (
                <ItemLongNote
                  key={i}
                  onClick={() => handleOpenLongNote(longNote)}
                  time={longNote.created_at}
                  content={longNote.content}
                  subtitle={longNote.title}
                  pubkey={longNote.pubkey}
                  author={longNote.author}
                />
              ))}
            </HorizontalSwipeContent>
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
    <StyledWrapVisibility isShow={isShow}>
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
              autoFocus: false
            }}
          />
        </StyledForm>
      </Container>

      {!searchValue && <ContactList />}

      {renderContent()}
    </StyledWrapVisibility>
  )
}
