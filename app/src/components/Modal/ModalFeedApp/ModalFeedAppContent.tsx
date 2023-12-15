import { Container } from '@/layout/Container/Conatiner'
import { useCallback, useState } from 'react'
import { StyledForm } from './styled'
import { Input } from '@/shared/Input/Input'
import { IconButton } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { AppNostroListItem } from '@/shared/AppNostroListItem/AppNostroListItem'
import { useAppSelector } from '@/store/hooks/redux'
import { AppNostr } from '@/types/app-nostr'
import { useOpenModalSearchParams } from '@/hooks/modal'

export const ModalFeedAppContent = () => {
  const [searchValue, setSearchValue] = useState('')
  const { handleOpenContextMenu } = useOpenModalSearchParams()

  const { apps } = useAppSelector((state) => state.apps)

  const handleOpenApp = useCallback(
    async (app: AppNostr) => {
      handleOpenContextMenu({ bech32: app.naddr, append: true })
    },
    [handleOpenContextMenu]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const filteredApps = (apps || []).filter((app) => {
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
          return <AppNostroListItem app={app} key={index} onClick={() => handleOpenApp(app)} />
        })}
      </div>
    </Container>
  )
}
