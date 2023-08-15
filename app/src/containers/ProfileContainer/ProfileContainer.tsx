import { useState } from 'react'
import Slide from '@mui/material/Slide'
import { StyledWrapper } from './styled'
import { Header } from './components/Header/Header'
import { useNavigate } from 'react-router-dom'
import { ProfilMenu } from './components/ProfileMenu/ProfileMenu'
import { ProfileView } from './components/ProfileView/ProfileView'

export const ProfileContainer = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(true)
  const handleClose = () => {
    setOpen(false)

    setTimeout(() => {
      navigate('/')
    }, 200)
  }

  return (
    <Slide direction="right" in={open}>
      <StyledWrapper>
        <Header handleClose={handleClose} />
        <ProfileView />
        <ProfilMenu />
      </StyledWrapper>
    </Slide>
  )
}
