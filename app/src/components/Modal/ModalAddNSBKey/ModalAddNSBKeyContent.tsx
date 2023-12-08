import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { Container } from '@/layout/Container/Conatiner'
import { IconButton } from '@mui/material'
import { StyledForm, StyledHint, StyledInput } from './styled'
import { useState } from 'react'
import { useAddKey } from '@/hooks/workspaces'

export const ModalAddNSBKeyContent = ({ handleCloseModal }: { handleCloseModal: () => void }) => {
  const { addNSBKey } = useAddKey()
  const [url, setUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await addNSBKey(url)
    handleCloseModal()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }

  return (
    <>
      <Container>
        <StyledForm onSubmit={handleSubmit}>
          <StyledInput
            placeholder="Enter npub or token from your nsecbunker"
            endAdornment={
              <IconButton type="submit" color="inherit" size="medium">
                <AddCircleOutlineOutlinedIcon />
              </IconButton>
            }
            onChange={handleChange}
            value={url}
            inputProps={{
              autoFocus: true
            }}
          />
        </StyledForm>
      </Container>
      <Container>
        <StyledHint>Paste your npub or nsecBunker token.</StyledHint>
      </Container>
    </>
  )
}
