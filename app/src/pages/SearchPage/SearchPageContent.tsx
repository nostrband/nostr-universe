import React, { useCallback, useEffect, useState, FC, CSSProperties } from 'react'
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
import {
  GroupHeader,
  GroupItems,
  StyledAutocomplete,
  StyledAutocompleteButton,
  StyledAutocompleteInput,
  StyledForm,
  StyledPopper
} from './styled'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setSearchValue } from '@/store/reducers/searchModal.slice'
import { useSearchParams } from 'react-router-dom'
import { StyledWrapVisibility } from '../styled'
import { ItemTrendingNote } from '@/components/ItemsContent/ItemTrendingNote/ItemTrendingNote'
import { Profile } from '@/shared/Profile/Profile'
import { ItemLongNote } from '@/components/ItemsContent/ItemLongNote/ItemLongNote'
import { dbi } from '@/modules/db'
import { v4 as uuidv4 } from 'uuid'
import { SearchTerm } from '@/modules/types/db'
import { IconButton, Box, Autocomplete, FilterOptionsState } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { RecentQueries } from './components/RecentQueries/RecentQueries'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { selectCurrentWorkspaceTabs } from '@/store/store'

const MAX_HISTORY = 10

interface IOptionApp {
  id: string
  icon: string
  label: string
  url: string
  groupName: string
  groupValue: string
}

export const SearchPageContent = () => {
  const [searchParams] = useSearchParams()
  const isShow = searchParams.get('page') === 'search'

  const { openBlank } = useOpenApp()
  const { searchValue } = useAppSelector((state) => state.searchModal)
  const { currentPubkey } = useAppSelector((state) => state.keys)
  const { apps = [] } = useAppSelector((state) => state.apps)
  const tabs = useAppSelector(selectCurrentWorkspaceTabs)
  const dispatch = useAppDispatch()

  const [profiles, setProfiles] = useState<MetaEvent[] | null>(null)
  const [notes, setNotes] = useState<AuthoredEvent[] | null>(null)
  const [longNotes, setLongNotes] = useState<LongNoteEvent[] | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [lastValue, setLastValue] = useState('')

  const [searchHistoryOptions, setSearchHistoryOptions] = useState<SearchTerm[]>([])
  const [isSearchHistoryLoading, setIsSearchHistoryLoading] = useState(false)

  const { handleOpenContextMenu } = useOpenModalSearchParams()

  const [selectApp, setSelectApp] = useState<IOptionApp | string | null>(null)
  const [openGroup, setOpenGroup] = useState<{ [key: string]: boolean }>({
    tabs: false,
    apps: false
  })

  const optionsApps: IOptionApp[] = apps.map((app, i) => ({
    id: `app-${i}`,
    icon: app.picture,
    label: app.name,
    url: app.url,
    groupName: 'Apps',
    groupValue: 'apps'
  }))
  const optionsTabs: IOptionApp[] = tabs.map((tab, i) => ({
    id: `tab-${i}`,
    icon: tab.icon,
    label: tab.title,
    url: tab.url,
    groupName: 'Tabs',
    groupValue: 'tabs'
  }))

  const getOptions = [...optionsTabs, ...optionsApps]

  const filterOptions = (options: IOptionApp[], state: FilterOptionsState<IOptionApp>) => {
    const inputValue = state.inputValue.toLowerCase()

    const filteredOptions = options.filter((option) => {
      const label = option.label.toLowerCase()
      const url = option.url.toLowerCase()
      return label.includes(inputValue) || url.includes(inputValue)
    })

    const sortGroup: Record<string, IOptionApp[]> = {}

    filteredOptions.forEach((obj) => {
      if (!sortGroup[obj.groupValue]) {
        sortGroup[obj.groupValue] = []
      }
      sortGroup[obj.groupValue].push(obj)
    })

    if (selectApp && typeof selectApp === 'object') {
      for (const group in sortGroup) {
        if (!openGroup[group]) {
          const currentIndex = sortGroup[group].findIndex((el) => el.id === selectApp.id)

          if (currentIndex >= 0 && currentIndex > 2) {
            const newData = [...sortGroup[group]]
            const element = newData[currentIndex]
            newData.splice(currentIndex, 1)

            newData.unshift(element)

            sortGroup[group] = newData
          }
        }
      }
    }

    for (const group in sortGroup) {
      if (!openGroup[group]) {
        sortGroup[group] = sortGroup[group].slice(0, 3)
      }
    }

    const concatSortGroupArrays: IOptionApp[] = ([] as IOptionApp[]).concat(...Object.values(sortGroup))

    return concatSortGroupArrays
  }

  const onSearch = useCallback(
    (str: string): boolean => {
      try {
        const url = new URL('/', str)
        if (url) {
          handleOpenContextMenu({ url: str })
          return true
        }
      } catch {
        /* empty */
      }

      const b32 = stringToBech32(str)
      if (b32) {
        handleOpenContextMenu({ bech32: b32 })
        return true
      }

      return false
    },
    [handleOpenContextMenu, openBlank]
  )

  const loadEvents = useCallback(
    async (searchValue: string) => {
      setIsLoading(true)
      console.log('searching', searchValue)
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
    },
    [setIsLoading, setProfiles, setNotes, setLongNotes]
  )

  const updateSearchHistory = useCallback(
    (history: SearchTerm[]) => {
      history.sort((a, b) => a.value.localeCompare(b.value))
      // eslint-disable-next-line
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
    searchHandler(typeof selectApp === 'string' || selectApp === null ? searchValue : selectApp.url)
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
    const RowProfile: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      if (profiles === null) {
        return null
      }

      const profile = profiles[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={profiles.length}>
          <Profile onClick={handleOpenProfile} profile={profile} />
        </HorizontalSwipeVirtualItem>
      )
    }

    const RowTrendingNote: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      if (notes === null) {
        return null
      }

      const note = notes[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={notes.length}>
          <ItemTrendingNote
            onClick={() => handleOpenNote(note)}
            time={note.created_at}
            content={note.content}
            pubkey={note.pubkey}
            author={note.author}
          />
        </HorizontalSwipeVirtualItem>
      )
    }

    const RowLongNote: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      if (longNotes === null) {
        return null
      }

      const longNote = longNotes[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={longNotes.length}>
          <ItemLongNote
            onClick={() => handleOpenLongNote(longNote)}
            time={longNote.created_at}
            content={longNote.content}
            subtitle={longNote.title}
            pubkey={longNote.pubkey}
            author={longNote.author}
          />
        </HorizontalSwipeVirtualItem>
      )
    }

    return (
      <>
        {profiles && (
          <StyledWrapper>
            <Container>
              <StyledTitle variant="h5" gutterBottom component="div">
                Profiles
              </StyledTitle>
            </Container>

            <HorizontalSwipeVirtualContent
              itemHight={164}
              itemSize={140}
              itemCount={profiles.length}
              RowComponent={RowProfile}
            />
          </StyledWrapper>
        )}

        {notes && (
          <StyledWrapper>
            <Container>
              <StyledTitleNotes variant="h5" gutterBottom component="div">
                Notes
              </StyledTitleNotes>
            </Container>

            <HorizontalSwipeVirtualContent
              itemHight={141}
              itemSize={225}
              itemCount={notes.length}
              RowComponent={RowTrendingNote}
            />
          </StyledWrapper>
        )}

        {longNotes && (
          <StyledWrapper>
            <Container>
              <StyledTitleLongPost variant="h5" gutterBottom component="div">
                Long posts
              </StyledTitleLongPost>
            </Container>

            <HorizontalSwipeVirtualContent
              itemHight={113}
              itemSize={225}
              itemCount={longNotes.length}
              RowComponent={RowLongNote}
            />
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

  const handleOpenGrop = (group: string) => {
    const keyGroup = group.toLowerCase()

    setOpenGroup((prev) => ({ ...prev, [keyGroup]: !prev[keyGroup] }))
  }

  const handleSelect = (_: React.SyntheticEvent<Element, Event>, selectedValue: IOptionApp | null | string) => {
    setSelectApp(selectedValue)
  }

  const onInputChange = (_: React.SyntheticEvent<Element, Event>, textValue: string) => {
    dispatch(setSearchValue({ searchValue: textValue }))
  }

  const isOptionEqualToValue = (option: IOptionApp, value: IOptionApp) =>
    option.label === value.label && option.url === value.url
  const getOptionLabel = (option: string | IOptionApp) =>
    typeof option === 'string' ? option : `${option.label} - ${option.url}`

  return (
    <StyledWrapVisibility isShow={isShow}>
      <Container>
        <StyledForm onSubmit={handleSubmit}>
          <StyledAutocomplete>
            <Autocomplete
              placeholder="Search"
              popupIcon={false}
              onChange={handleSelect}
              onInputChange={onInputChange}
              inputValue={searchValue}
              value={selectApp ? selectApp : null}
              isOptionEqualToValue={isOptionEqualToValue}
              PopperComponent={StyledPopper}
              fullWidth
              options={getOptions}
              getOptionLabel={getOptionLabel}
              filterOptions={filterOptions}
              groupBy={(option) => option.groupName}
              renderGroup={(params) => {
                return (
                  <li key={params.key}>
                    <GroupHeader>
                      {params.group}
                      <div onClick={() => handleOpenGrop(params.group)}>
                        {openGroup[params.group.toLocaleLowerCase()] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </div>
                    </GroupHeader>
                    <GroupItems>{params.children}</GroupItems>
                  </li>
                )
              }}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option.id}>
                  <img loading="lazy" width="20" srcSet={option.icon} src={option.icon} alt={option.label} />
                  {option.label} - {option.url}
                </Box>
              )}
              freeSolo
              renderInput={(params) => <StyledAutocompleteInput {...params} placeholder="Search" />}
            />
            <StyledAutocompleteButton>
              <IconButton type="submit" color="inherit" size="medium">
                <SearchOutlinedIcon />
              </IconButton>
            </StyledAutocompleteButton>
          </StyledAutocomplete>
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
