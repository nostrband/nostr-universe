import { Container } from '@/layout/Container/Conatiner'
import { FC, useState } from 'react'
import { StyledForm } from './styled'
import { Input } from '@/shared/Input/Input'
import { IconButton } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { AppNostroListItem } from '@/shared/AppNostroListItem/AppNostroListItem'
import { useAppSelector } from '@/store/hooks/redux'
import { usePins } from '@/hooks/pins'
import { AppNostr } from '@/types/app-nostr'

type ModalFindAppContentProps = {
  handleClose: () => void
}

export const ModalFindAppContent: FC<ModalFindAppContentProps> = ({ handleClose }) => {
  const [searchValue, setSearchValue] = useState('')

  const { onPinApp } = usePins()

  const { apps = [] } = useAppSelector((state) => state.apps)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const filteredApps = apps.filter((app) => {
    const search = searchValue.toLowerCase()
    return app.name.toLowerCase().includes(search) || app.about?.toLowerCase().includes(search)
  })

  return (
    <Container>
      <StyledForm>
        <Input
          placeholder="Search app"
          endAdornment={
            <IconButton color="inherit" size="medium">
              <SearchOutlinedIcon />
            </IconButton>
          }
          onChange={handleChange}
          value={searchValue}
          inputProps={{
            autoFocus: false
          }}
        />
      </StyledForm>
      <div>
        {filteredApps.map((app: AppNostr, index: number) => {
          return <AppNostroListItem app={app} key={index} onClick={() => onPinApp(app).then(handleClose)} />
        })}
      </div>
    </Container>
  )
}
