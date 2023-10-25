import React, { useCallback, useEffect, useState, FC, CSSProperties, useRef } from 'react'
import { useOpenModalSearchParams } from '@/hooks/modal'
import CloseIcon from '@mui/icons-material/Close'
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
  StyledAutocompleteInput,
  StyledForm,
  StyledOptionText,
  StyledPopper
} from './styled'
import { StyledInputBox } from './styled'
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
import { IconButton, Box, Autocomplete } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { RecentQueries } from './components/RecentQueries/RecentQueries'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { selectCurrentWorkspaceTabs } from '@/store/store'
import { AppIcon } from '@/shared/AppIcon/AppIcon'

const MAX_HISTORY = 10

interface IDropdownOption {
  id: string
  icon: string
  label: string
  value: string
  type: 'app' | 'tab'
  group: string
}

export const SearchPageContent = () => {
  const [searchParams] = useSearchParams()
  const isShow = searchParams.get('page') === 'search'

  const { searchValue } = useAppSelector((state) => state.searchModal)
  const { currentPubkey } = useAppSelector((state) => state.keys)
  const { apps = [] } = useAppSelector((state) => state.apps)
  const tabs = useAppSelector(selectCurrentWorkspaceTabs)
  const dispatch = useAppDispatch()

  const [suggestion, setSuggestion] = useState('')

  const [profiles, setProfiles] = useState<MetaEvent[] | null>(null)
  const [notes, setNotes] = useState<AuthoredEvent[] | null>(null)
  const [longNotes, setLongNotes] = useState<LongNoteEvent[] | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [lastValue, setLastValue] = useState('')
  const inputRef = useRef<HTMLElement>()

  const [searchHistoryOptions, setSearchHistoryOptions] = useState<SearchTerm[]>([])
  const [isSearchHistoryLoading, setIsSearchHistoryLoading] = useState(false)

  const { handleOpenContextMenu, handleOpenTab } = useOpenModalSearchParams()

  const [selectApp, setSelectApp] = useState<IDropdownOption | string | null>(null)
  const [openGroup, setOpenGroup] = useState<{ [key: string]: boolean }>({
    tabs: false,
    apps: false
  })

  const getTypeName = (type: string) => {
    switch (type) {
      case 'app':
        return 'Apps'
      case 'tab':
        return 'Tabs'
    }
    return 'Other'
  }

  // FIXME add pins!
  const optionsApps: IDropdownOption[] = apps.map((app, i) => {
    return {
      id: `app-${i}`,
      icon: app.picture,
      label: app.name,
      value: app.naddr || app.url,
      type: 'app',
      group: getTypeName('app')
    }
  })

  const optionsTabs: IDropdownOption[] = tabs.map((tab, i) => {
    let label = `${tab.title}: ${tab.url}`
    try {
      const u = new URL(tab.url)
      label = `${tab.title}: ${u.hostname.replace(/^www./i, '')}`
      if (u.pathname != '/') label += u.pathname
    } catch {
      /* empty */
    }
    return {
      id: `tab-${i}`,
      icon: tab.icon,
      label,
      value: tab.id,
      type: 'tab',
      group: getTypeName('tab')
    }
  })

  const getOptions = [...optionsTabs, ...optionsApps]

  const filterOptionsByValue = (options: IDropdownOption[], str: string) => {
    const inputValue = str.toLowerCase()
    return options.filter((option) => {
      const label = option.label.toLowerCase()
      const url = option.value.toLowerCase()
      return label.includes(inputValue) || url.includes(inputValue)
    })
  }

  const filterOptions = (options: IDropdownOption[]) => {

    // NOTE: using state.inputValue instead of searchValue is buggy:
    // - enter long non-matching value to have empty dropdown
    // - click out and then back to input - all items show up
    const filteredOptions = filterOptionsByValue(options, searchValue)

    const sortGroup: Record<string, IDropdownOption[]> = {}

    filteredOptions.forEach((obj) => {
      if (!sortGroup[obj.group]) {
        sortGroup[obj.group] = []
      }
      sortGroup[obj.group].push(obj)
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

    const concatSortGroupArrays: IDropdownOption[] = ([] as IDropdownOption[]).concat(...Object.values(sortGroup))

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
    [handleOpenContextMenu]
  )

  const loadEvents = useCallback(
    async (value: string) => {
      setIsLoading(true)
      console.log('searching', value)
      searchProfiles(value)
        .then((data) => {
          console.log('profiles', data)
          setProfiles(data)
        })
        .then(() => searchNotes(value))
        .then((data) => {
          console.log('notes', data)
          setNotes(data)
        })
        .then(() => searchLongNotes(value))
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

      const filtered = history
        .map((e, i, a) => {
          if (!i || a[i - 1].value !== e.value) return e
        })
        .filter((e) => e !== undefined)
        .slice(0, MAX_HISTORY) as SearchTerm[]

      filtered.sort((a, b) => b.timestamp - a.timestamp)

      setSearchHistoryOptions(filtered)
    },
    [setSearchHistoryOptions]
  )

  const searchHandler = useCallback(
    (value: string) => {
      if (value.trim().length > 0) {
        const trimmedValue = value.trim()
        // if custom handler executed then we don't proceed
        if (onSearch(trimmedValue)) return

        if (trimmedValue !== lastValue) {
          setNotes(null)
          setLongNotes(null)
          setProfiles(null)
        }
        setLastValue(trimmedValue)
        loadEvents(trimmedValue)

        const term = {
          id: uuidv4(),
          value: trimmedValue,
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
    const value = typeof selectApp === 'string' || selectApp === null ? suggestion || searchValue : selectApp.value
    console.log('value', value)
    dispatch(setSearchValue({ searchValue: value }))
    setSuggestion('')
    searchHandler(value)
  }

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    dispatch(setSearchValue({ searchValue: '' }))
    setSuggestion('')
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
    [searchHandler, dispatch]
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

  const handleOpenGroup = (group: string) => {
    setOpenGroup((prev) => ({ ...prev, [group]: !prev[group] }))
  }

  const handleSelect = (_: React.SyntheticEvent<Element, Event>, selectedValue: IDropdownOption | null | string) => {
    setSelectApp(selectedValue)
  }

  const onInputChange = (_: React.SyntheticEvent<Element, Event>, textValue: string) => {
    // we had a suggestion and user clicked backspace?
    const reduced = searchValue.length > textValue.length
    if (reduced && suggestion.length !== searchValue.length) {
      const wasSug = suggestion != ''
      if (wasSug) {
        setSuggestion('')
        setTimeout(() => {
          dispatch(setSearchValue({ searchValue }))
        }, 0)
        return
      }
    }
    dispatch(setSearchValue({ searchValue: textValue }))

    if (!reduced && textValue.trim().length) {
      const suggestion = searchHistoryOptions.find((s) => s.value.toLowerCase().startsWith(textValue.toLowerCase()))
      setSuggestion(suggestion?.value || '')
    } else {
      setSuggestion('')
    }
  }

  const isOptionEqualToValue = (option: IDropdownOption, value: IDropdownOption) =>
    option.label === value.label && option.value === value.value

  const getOptionLabel = (option: string | IDropdownOption) => {
    if (typeof option === 'string') return option
    return option.value
  }

  const handleAcceptSuggestion = () => {
    const isSuggestionExists = suggestion.trim().length !== 0
    if (!isSuggestionExists) return undefined
    dispatch(setSearchValue({ searchValue: suggestion }))
  }

  const onOptionClick = (option: IDropdownOption) => {
    switch (option.type) {
      case 'tab':
        handleOpenTab(option.value)
        break
      default:
        onSearch(option.value)
        break
    }
  }

  const getGroupCount = (group: string) => {
    return filterOptionsByValue(getOptions, searchValue).filter((o) => o.group === group).length
  }

  return (
    <StyledWrapVisibility isShow={isShow}>
      <Container>
        <StyledForm onSubmit={handleSubmit}>
          <StyledAutocomplete>
            <Autocomplete
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
              groupBy={(option) => option.group}
              sx={{ position: 'absolute', background: 'none' }}
              renderGroup={(params) => {
                return (
                  <li key={params.key}>
                    <GroupHeader onClick={() => handleOpenGroup(params.group)}>
                      {params.group} ({getGroupCount(params.group)})
                      {openGroup[params.group] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </GroupHeader>
                    <GroupItems>{params.children}</GroupItems>
                  </li>
                )
              }}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.id} onClick={() => onOptionClick(option)}>
                  <AppIcon isPreviewTab isRounded={true} picture={option.icon} alt={option.label} />
                  <StyledOptionText>{option.label}</StyledOptionText>
                </Box>
              )}
              freeSolo
              renderInput={(params) => (
                <StyledAutocompleteInput
                  {...params}
                  onClick={handleAcceptSuggestion}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {Boolean(searchValue.length) && (
                          <IconButton type="button" color="inherit" size="medium" onClick={handleClear}>
                            <CloseIcon />
                          </IconButton>
                        )}
                        <IconButton type="submit" color="inherit" size="medium">
                          <SearchOutlinedIcon />
                        </IconButton>
                      </>
                    )
                  }}
                  placeholder="Keyword, url, npub or note id"
                />
              )}
            />
          </StyledAutocomplete>
          <StyledInputBox>
            <div className="suggestion_block">
              <span className="hidden_part">{searchValue}</span>
              <span className="suggestion_value">
                {suggestion.substring(searchValue.length).replace(/ /g, '\u00A0')}
              </span>
            </div>
          </StyledInputBox>
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
