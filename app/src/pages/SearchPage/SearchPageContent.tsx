import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { useOpenApp } from '@/hooks/open-entity'
import { nostrbandRelay, searchLongNotes, searchNotes, searchProfiles, stringToBech32 } from '@/modules/nostr'
import { AuthoredEvent } from '@/types/authored-event'
import { LongNoteEvent } from '@/types/long-note-event'
import { MetaEvent } from '@/types/meta-event'
import { nip19 } from '@nostrband/nostr-tools'
import { Container } from '@/layout/Container/Conatiner'
import { StyledTitle, StyledWrapper } from '@/pages/MainPage/components/SuggestedProfiles/styled'
import { StyledTitle as StyledTitleNotes } from '@/pages/MainPage/components/TrendingNotes/styled'
import { StyledTitle as StyledTitleLongPost } from '@/pages/MainPage/components/LongPosts/styled'
import { LoadingContainer, LoadingSpinner } from '@/shared/LoadingSpinner/LoadingSpinner'
import { StyledForm, StyledInput } from './styled'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setSearchValue } from '@/store/reducers/searchModal.slice'
import { useSearchParams } from 'react-router-dom'
import { StyledWrapVisibility } from '../styled'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { ItemTrendingNote } from '@/components/ItemsContent/ItemTrendingNote/ItemTrendingNote'
import { Profile } from '@/shared/Profile/Profile'
import { ItemLongNote } from '@/components/ItemsContent/ItemLongNote/ItemLongNote'
import { dbi } from '@/modules/db'
import { v4 as uuidv4 } from 'uuid'
import { SearchTerm } from '@/modules/types/db'
import { IconButton } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import CloseIcon from '@mui/icons-material/Close'
import { RecentQueries } from './components/RecentQueries/RecentQueries'

const MAX_HISTORY = 10

export const SearchPageContent = () => {
  const [searchParams] = useSearchParams()
  const isShow = searchParams.get('page') === 'search'

  const { openBlank } = useOpenApp()
  const { searchValue } = useAppSelector((state) => state.searchModal)
  const { currentPubkey } = useAppSelector((state) => state.keys)
  const dispatch = useAppDispatch()

  const [profiles, setProfiles] = useState<MetaEvent[] | null>(null)
  const [notes, setNotes] = useState<AuthoredEvent[] | null>(null)
  const [longNotes, setLongNotes] = useState<LongNoteEvent[] | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [lastValue, setLastValue] = useState('')

  const [searchHistoryOptions, setSearchHistoryOptions] = useState<SearchTerm[]>([])
  const [isSearchHistoryLoading, setIsSearchHistoryLoading] = useState(false)

  const { handleOpenContextMenu } = useOpenModalSearchParams()
  const inputRef = useRef<HTMLElement>()

  const onSearch = useCallback(
    (str: string): boolean => {
      try {
        const url = new URL('/', str)
        if (url) {
          handleOpenContextMenu({ url: str })
          return true
        }
      } catch {}

      const b32 = stringToBech32(str)
      if (b32) {
        handleOpenContextMenu({ bech32: b32 })
        return true
      }

      return false
    },
    [handleOpenContextMenu, openBlank]
  )

  const loadEvents = useCallback(async (searchValue: string) => {
    setIsLoading(true)
    console.log("searching", searchValue)
    searchProfiles(searchValue)
      .then((data) => {
        console.log('profiles', data)
        setProfiles(data)
      })
      .then(() => searchNotes(searchValue))
      .then((data) => {
        console.log('notes', data)
        setNotes(data)
      })
      .then(() => searchLongNotes(searchValue))
      .then((data) => {
        console.log('long notes', data)
        setLongNotes(data)
      })
      .finally(() => setIsLoading(false))
  }, [setIsLoading, setProfiles, setNotes, setLongNotes])

  const updateSearchHistory = useCallback(
    (history: SearchTerm[]) => {
      history.sort((a, b) => a.value.localeCompare(b.value))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const filtered: SearchTerm[] = history
        .map((e, i, a) => {
          if (!i || a[i - 1].value !== e.value) return e
        })
        .filter((e) => e !== undefined)
        .slice(0, MAX_HISTORY)

      filtered.sort((a, b) => b.timestamp - a.timestamp)

      setSearchHistoryOptions(filtered)
    },
    [setSearchHistoryOptions]
  )

  const searchHandler = useCallback(
    (value: string) => {
      if (value.trim().length > 0) {
        // if custom handler executed then we don't proceed
        if (onSearch(value)) return

        if (value !== lastValue) {
          setNotes(null)
          setLongNotes(null)
          setProfiles(null)
        }
        setLastValue(value)
        loadEvents(value)

        const term = {
          id: uuidv4(),
          value: value,
          timestamp: Date.now(),
          pubkey: currentPubkey
        }

        updateSearchHistory([term, ...searchHistoryOptions])

        dbi.addSearchTerm(term)
      }
    },
    [currentPubkey, lastValue, loadEvents, onSearch, searchHistoryOptions, updateSearchHistory]
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    inputRef.current?.blur()
    searchHandler(searchValue)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchValue({ searchValue: e.target.value }))
  }

  const handleClear = () => {
    dispatch(setSearchValue({ searchValue: '' }))
  }

  const handleOpenProfile = (profile: MetaEvent) => {
    const nprofile = nip19.nprofileEncode({
      pubkey: profile.pubkey,
      relays: [nostrbandRelay]
    })

    handleOpenContextMenu({ bech32: nprofile })
  }

  const handleOpenNote = (note: AuthoredEvent) => {
    const nevent = nip19.neventEncode({
      relays: [nostrbandRelay],
      id: note.id
    })

    handleOpenContextMenu({ bech32: nevent })
  }

  const handleOpenLongNote = (longNote: LongNoteEvent) => {
    const naddr = nip19.naddrEncode({
      pubkey: longNote.pubkey,
      kind: longNote.kind,
      identifier: longNote.identifier,
      relays: [nostrbandRelay]
    })

    handleOpenContextMenu({ bech32: naddr })
  }

  useEffect(() => {
    if (searchValue.trim().length) {
      // WHY? It's re-searching on any state change,
      // which makes no sense, and doesn't help anywhere else
//      loadEvents(searchValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadEvents])

  const getSearchHistory = useCallback(async () => {
    if (!currentPubkey) return undefined

    setIsSearchHistoryLoading(true)
    const history = await dbi
      .getSearchHistory(currentPubkey, MAX_HISTORY * 10)
      .finally(() => setIsSearchHistoryLoading(false))

    if (history) {
      updateSearchHistory(history)
    }
  }, [currentPubkey, updateSearchHistory, setIsSearchHistoryLoading])

  useEffect(() => {
    getSearchHistory()
  }, [getSearchHistory, isShow])

  const deleteSearchTermHandler = useCallback(
    (id: string) => {
      dbi.deleteSearchTerm(id).then(getSearchHistory)
    },
    [getSearchHistory]
  )

  const clickSearchTermItemHandler = useCallback(
    (searchTerm: SearchTerm) => {
      dispatch(setSearchValue({ searchValue: searchTerm.value }))
      searchHandler(searchTerm.value)
    },
    [searchHandler, dispatch, setSearchValue]
  )

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
              <>
                {searchValue && (
                  <IconButton type="button" color="inherit" size="medium" onClick={handleClear}>
                    <CloseIcon />
                  </IconButton>
                )}
                <IconButton type="submit" color="inherit" size="medium">
                  <SearchOutlinedIcon />
                </IconButton>
              </>
            }
            onChange={handleChange}
            value={searchValue}
            inputProps={{
              autoFocus: false,
              ref: inputRef
            }}
          />
        </StyledForm>
      </Container>

      {!searchValue && (
        <>
          {searchHistoryOptions.length > 0 && (
            <RecentQueries
              isLoading={isSearchHistoryLoading}
              queries={searchHistoryOptions}
              onDeleteSearchTerm={deleteSearchTermHandler}
              onClickSearchTerm={clickSearchTermItemHandler}
            />
          )}
        </>
      )}

      {searchValue === lastValue && renderContent()}
    </StyledWrapVisibility>
  )
}
