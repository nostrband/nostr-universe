import { useState } from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Container } from '@/layout/Container/Conatiner'
import { IconButton } from '@mui/material'
import { searchProfiles } from '@/modules/nostr'
import { SliderProfiles } from '@/components/Slider/SliderProfiles/SliderProfiles'
import { useOpenApp } from '@/hooks/open-entity'
import { StyledForm, StyledHint, StyledInput, StyledSlider } from './styled'
import { LoadingContainer, LoadingSpinner } from '@/shared/LoadingSpinner/LoadingSpinner'
import { MetaEvent } from '@/types/meta-event'
import { IModalImportKeyContent } from './types'

export const ModalImportKeyContent = ({ handleCloseModal }: IModalImportKeyContent) => {
  const { onImportKey } = useOpenApp()
  const [searchValue, setSearchValue] = useState('')
  const [profiles, setProfiles] = useState<MetaEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const data = await searchProfiles(searchValue)

      setProfiles(data)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleProfileSetKey = async (profile: MetaEvent) => {
    await onImportKey(profile.pubkey)
    handleCloseModal()
  }

  return (
    <>
      {' '}
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
              autoFocus: true
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
          <StyledSlider>
            <SliderProfiles data={profiles} isLoading={false} handleClickEntity={handleProfileSetKey} />
          </StyledSlider>
          <Container>
            <StyledHint>Paste an npub of some existing user to log in.</StyledHint>
            <StyledHint>Or type something to search for matching profiles, then click on one to import it.</StyledHint>
          </Container>
        </>
      )}
    </>
  )
}
