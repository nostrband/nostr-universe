import { Box } from '@mui/material'
import Slide from '@mui/material/Slide'
export const ProfileContainer = () => {
  return (
    <Slide direction="right" in>
      <Box sx={{ position: 'fixed', left: 0, top: 0, height: '100%', width: '100%', background: '#000', zIndex: 1 }}>
        ProfileContainer
      </Box>
    </Slide>
  )
}
