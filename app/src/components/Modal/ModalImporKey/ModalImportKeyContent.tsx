import { useRef, useState } from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Container } from '@/layout/Container/Conatiner'
import { IconButton } from '@mui/material'
import { searchProfiles } from '@/modules/nostr'
import { StyledForm, StyledHint, StyledInput, StyledSlider } from './styled'
import { LoadingContainer, LoadingSpinner } from '@/shared/LoadingSpinner/LoadingSpinner'
import { MetaEvent } from '@/types/meta-event'
import { IModalImportKeyContent } from './types'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonProfiles } from '@/components/Skeleton/SkeletonProfiles/SkeletonProfiles'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { Profile } from '@/shared/Profile/Profile'
import { useAddKey } from '@/hooks/workspaces'

export const ModalImportKeyContent = ({ handleCloseModal }: IModalImportKeyContent) => {
  const { addReadOnlyKey } = useAddKey()
  const [searchValue, setSearchValue] = useState('')
  const [profiles, setProfiles] = useState<MetaEvent[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLElement>()

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const data = await searchProfiles(searchValue)

      setProfiles(data)
    } catch (error) {
      console.log(error)
      setProfiles(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    inputRef.current?.blur()
    handleSearch()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleProfileSetKey = async (pubkey: string) => {
    await addReadOnlyKey(pubkey)
    handleCloseModal()
  }

  const renderContent = () => {
    if (isLoading) {
      return <SkeletonProfiles />
    }
    if (!profiles || !profiles.length) {
      return <EmptyListMessage onReload={handleSearch} />
    }
    return profiles.map((profile, i) => <Profile key={i} onClick={handleProfileSetKey} profile={profile} />)
  }

  return (
    <>
      <Container>
        <StyledForm onSubmit={handleSubmit}>
          <StyledInput
            placeholder="Enter npub or a username"
            endAdornment={
              <IconButton type="submit" color="inherit" size="medium">
                <SearchOutlinedIcon />
              </IconButton>
            }
            onChange={handleChange}
            value={searchValue}
            inputProps={{
              autoFocus: true,
              ref: inputRef
            }}
          />
        </StyledForm>
      </Container>
      {isLoading && (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      )}
      {!isLoading && (
        <>
          {searchValue && profiles !== null && (
            <StyledSlider>
              <HorizontalSwipeContent childrenWidth={140}>{renderContent()}</HorizontalSwipeContent>
            </StyledSlider>
          )}
          <Container>
            <StyledHint>Paste an npub of some existing user to log in.</StyledHint>
            <StyledHint>Or type something to search for matching profiles, then click on one to import it.</StyledHint>
          </Container>
        </>
      )}
    </>
  )
}
