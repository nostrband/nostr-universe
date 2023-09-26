import { useState } from 'react'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Modal } from '@/modules/Modal/Modal'
import { Container } from '@/layout/Container/Conatiner'
import { IconButton } from '@mui/material'
import { searchProfiles } from '@/modules/nostr'
import { SliderProfiles } from '@/components/Slider/SliderProfiles/SliderProfiles'
import { useOpenApp } from '@/hooks/open-entity'
import { StyledForm, StyledHint, StyledInput, StyledSlider } from './styled'
import { LoadingContainer, LoadingSpinner } from '@/shared/LoadingSpinner/LoadingSpinner'
import { MetaEvent } from '@/types/meta-event'

export const ModalImportKey = () => {
  const { onImportKey } = useOpenApp()
  const [searchValue, setSearchValue] = useState('')
  const [profiles, setProfiles] = useState<MetaEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { handleClose, getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.KEY_IMPORT)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    searchProfiles(searchValue)
      .then((data) => {
        setProfiles(data)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleProfileSetKey = async (profile: MetaEvent) => {
    await onImportKey(profile.pubkey)
    handleClose()
  }

  const handleCloseModal = () => {
    handleClose()
  }

  return (
    <Modal title="Add read-only keys" open={isOpen} handleClose={handleCloseModal}>
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
    </Modal>
  )
}
