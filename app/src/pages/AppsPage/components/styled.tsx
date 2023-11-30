import { AppIcon } from '@/shared/AppIcon/AppIcon'
import { Input } from '@/shared/Input/Input'
import {
  Box,
  Dialog,
  DialogProps,
  Grid,
  GridProps,
  InputBaseProps,
  Menu,
  MenuProps,
  Typography,
  TypographyProps,
  Zoom,
  styled
} from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'

export const StyledGroupName = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function GroupNameDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)(({ theme }) => ({
  color: theme.palette.light.light,
  fontSize: 10,
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '60px',
  margin: '0 auto',
  marginTop: 2,
  whiteSpace: 'nowrap',
  textAlign: 'center'
}))

export const StyledGroup = styled((props: GridProps) => (
  <Zoom in>
    <Grid {...props} columns={2} container />
  </Zoom>
))({
  transform: 'initial',
  width: 60,
  height: 60,
  margin: '0 auto',
  background: '#aaaaaabc',
  borderRadius: '12px',
  padding: '0.25rem',
  cursor: 'pointer',
  overflow: 'hidden',
  justifyContent: 'space-between',
  rowGap: '5px',
  transition: 'scale 0.2s',
  '&.__over': {
    transform: 'scale(1.05) !important'
  }
})

export const StyledGroupContainer = styled((props: GridProps) => (
  <Zoom in>
    <Grid {...props} columns={2} container />
  </Zoom>
))({
  width: 60,
  height: 60,
  margin: '0 auto',
  background: '#aaaaaabc',
  borderRadius: '12px',
  padding: '0.25rem',
  overflow: 'hidden',
  cursor: 'pointer',
  justifyContent: 'space-between',
  rowGap: '5px'
})

export const StyledAppIcon = styled(AppIcon)({
  width: 24,
  height: 24,
  minWidth: 24,
  borderRadius: 8
})

export const StyledInput = styled((props: InputBaseProps) => (
  <Input classes={{ readOnly: 'read_only', focused: 'focused' }} {...props} />
))(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 'bold',
  textAlign: 'center',
  border: '1px solid transparent',
  transition: 'border 0.2s ease-in-out',
  '&:not(.read_only)': {
    border: '1px solid ' + theme.palette.text.primary
  }
}))

export const StyledDialog = styled((props: DialogProps) => (
  <Dialog
    {...props}
    keepMounted
    PaperProps={{
      sx(theme) {
        return {
          background: theme.palette.secondary.main
        }
      }
    }}
    fullWidth
  />
))({})

export const StyledDroppableContainer = styled(
  forwardRef(function DroppableContainer({ children, ...props }: GridProps, ref: ForwardedRef<HTMLDivElement>) {
    return (
      <Grid ref={ref} item xs={2} {...props}>
        <Box>{children}</Box>
      </Grid>
    )
  })
)({
  transition: 'background 0.2s',
  cursor: 'pointer'
})

export const StyledMenu = styled((props: MenuProps) => (
  <Menu
    {...props}
    anchorOrigin={{
      horizontal: 'left',
      vertical: 'top'
    }}
    MenuListProps={{
      sx: {
        padding: 0,
        color: 'white',
        '& .MuiMenuItem-root': {
          padding: '0.5rem 1rem'
        },
        '& .MuiListItemIcon-root': {
          color: 'inherit'
        }
      }
    }}
    slotProps={{
      paper: {
        sx(theme) {
          return {
            background: theme.palette.secondary.main
          }
        }
      }
    }}
  />
))({})
