import { useState } from 'react'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Modal } from '@/modules/Modal/Modal'
import { Container } from '@/layout/Container/Conatiner'
import { IconButton } from '@mui/material'
import { searchProfiles } from '@/modules/nostr'
import { ITrendingProfiles, TrendingProfile } from '@/types/trending-profiles'
import { SliderProfiles } from '@/components/Slider/SliderProfiles/SliderProfiles'
import { useOpenApp } from '@/hooks/open-entity'
import { StyledForm, StyledHint, StyledInput, StyledSlider } from './styled'

export const ModalImportKey = () => {
  const { onImportKey } = useOpenApp()
  const [searchValue, setSearchValue] = useState('')
  const [profiles, setProfiles] = useState<ITrendingProfiles>([])
  const { handleClose, getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.KEY_IMPORT)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    searchProfiles(searchValue).then((data) => {
      console.log(data)
      const r = data.map((el) => el.profile)
      setProfiles(r)
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleProfileSetKey = async (profile: TrendingProfile) => {
    await onImportKey(profile.pubkey)
    handleClose()
  }

  return (
    <Modal title="Add read-only keys" open={isOpen} handleClose={handleClose}>
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

      <StyledSlider>
        <SliderProfiles data={profiles} isLoading={false} handleClickEntity={handleProfileSetKey} />
      </StyledSlider>

      <Container>
        <StyledHint>Paste an npub of some existing user to log in.</StyledHint>
        <StyledHint>Or type something to search for matching profiles, then click on one to import it.</StyledHint>
      </Container>
    </Modal>
  )
}
