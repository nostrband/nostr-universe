import { Typography } from '@mui/material'
import { Container } from '@/layout/Container/Conatiner'
import { StyledLogs, StyledViewTitle, StyledWrap } from './styled'
import { AppLogo } from '@/assets'
import { AppIcon } from '@/shared/AppIcon/AppIcon'
import { useEffect, useState } from 'react'

export const ModalAboutContent = () => {
  const [logs, setLogs] = useState<string>('')

  useEffect(() => {
    // eslint-disable-next-line
    // @ts-ignore
    if (window.NativeLogs) {
      // eslint-disable-next-line
      // @ts-ignore
      window.NativeLogs.getLog(100, false, (logs) => {
        setLogs(logs)
      })
    } else {
      setLogs(`Some random long string of text for testing purposes.\n
      And then here is the second row, let's hope it looks better now.
      `)
    }
  }, [])

  return (
    <Container>
      <StyledWrap>
        <AppIcon isLight size="big" isOutline={false} picture={AppLogo} />
        <StyledViewTitle variant="h5">The Nostr Browser</StyledViewTitle>
        <StyledViewTitle variant="body1">0.9.0</StyledViewTitle>
        <Typography variant="body1">Spring is an open-source project by Nostr.Band.</Typography>
        {logs && <StyledLogs readOnly={true}>{logs}</StyledLogs>}
      </StyledWrap>
    </Container>
  )
}
