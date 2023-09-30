import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { Avatar, ListItemAvatar, ListItemText } from '@mui/material'
import { Container } from '@/layout/Container/Conatiner'
import { useAppSelector } from '@/store/hooks/redux'
import { useSearchParams } from 'react-router-dom'
import { StyledViewTitle, StyledListItem, StyledListItemText, StyledList } from './styled'
import { getRenderedUsername } from '@/utils/helpers/general'
import { getOrigin, getProfileImage } from '@/utils/helpers/prepare-data'
import { getTabGroupId } from '@/modules/AppInitialisation/utils'
import { IPerm } from '@/types/permission-req'
import { selectTab } from '@/store/reducers/tab.slice'
import { walletstore } from '@/modules/walletstore'
import { useEffect, useState } from 'react'
import { selectCurrentWorkspace } from '@/store/store'

export const ModalProfileTabMenuContent = () => {
  const [searchParams] = useSearchParams()
  const [perms, setPerms] = useState<IPerm[]>([])
  const id = searchParams.get('tabId') || ''
  const { currentProfile } = useAppSelector((state) => state.profile)
  const { currentPubkey } = useAppSelector((state) => state.keys)

  const currentWorkSpace = useAppSelector(selectCurrentWorkspace)
  const currentTab = useAppSelector((state) => selectTab(state, id))

  useEffect(() => {

    const prepareLabel = (perm: string, wallets: any): string => {
      if (perm === 'pubkey') {
        return 'Read your public key'
      } else if (perm?.startsWith('pay_invoice:')) {
        const id = perm?.split(':')[1]
        const info = wallets ? wallets[id] : {}
        const name = info.name || id
        return `Payment from wallet '${name}'`
      } else if (perm?.startsWith('sign:')) {
        const kind = perm?.split(':')[1]
        return 'Sign event of kind ' + kind
      } else if (perm === 'encrypt') {
        return 'Encrypt a message'
      } else if (perm === 'decrypt') {
        return 'Decrypt a message'
      }
      return ''
    }


    const load = async () => {
      const wallets = await walletstore.listWallets()

      const perms = currentTab && currentWorkSpace
        ? (currentWorkSpace.perms.filter((perm) => perm.app === getTabGroupId(currentTab))
          .map((p) => ({ ...p } as IPerm)))
        : []

      for (const p of perms)
        p.label = prepareLabel(p.name, wallets)

      setPerms(perms)
    }

    load()
  }, [id])


  return (
    <Container>
      <StyledViewTitle>Account</StyledViewTitle>
      <StyledList dense>
        <StyledListItem disablePadding>
          <ListItemAvatar>
            <Avatar src={getProfileImage(currentProfile)}>
              <ImageOutlinedIcon />
            </Avatar>
          </ListItemAvatar>
          <StyledListItemText primary={getRenderedUsername(currentProfile, currentPubkey)} />
        </StyledListItem>
      </StyledList>

      <StyledViewTitle>App</StyledViewTitle>
      <StyledList dense>
        <StyledListItem disablePadding>
          <ListItemAvatar>
            <Avatar src={currentTab?.icon}>
              <ImageOutlinedIcon />
            </Avatar>
          </ListItemAvatar>
          <StyledListItemText primary={currentTab?.title} />
        </StyledListItem>
        <StyledListItem disablePadding>
          <ListItemText primary={'Address: ' + getOrigin(currentTab?.url || '')} />
        </StyledListItem>
      </StyledList>

      <StyledViewTitle>Permissions</StyledViewTitle>
      <StyledList dense>
        {!perms.length ? (
          <StyledListItem disablePadding>
            <ListItemText primary="No permissions given yet." />
          </StyledListItem>
        ) : (
          <>
            {perms.map((perm, i) => (
              <StyledListItem key={i} disablePadding>
                <ListItemText primary={perm.label} />
              </StyledListItem>
            ))}
          </>
        )}
      </StyledList>
    </Container>
  )
}
