import {
  Box,
  FormLabel,
  FormLabelProps,
  Switch,
  SwitchProps,
  TextareaAutosize,
  TextareaAutosizeProps,
  styled
} from '@mui/material'
import { red } from '@mui/material/colors'

const asteriskColor = red[500]

export const StyledLabel = styled((props: FormLabelProps & { spacing?: boolean }) => {
  const exclude = new Set(['spacing'])
  const omitProps = Object.fromEntries(Object.entries(props).filter((e) => !exclude.has(e[0])))
  return <FormLabel {...omitProps} classes={{ asterisk: 'asterisk' }} />
})(({ theme, spacing = true }) => ({
  color: theme.palette.light.light,
  marginBottom: spacing ? theme.spacing(1) : '0',
  display: spacing ? 'block' : 'inline-block',
  fontWeight: 600,
  '& .asterisk': {
    color: asteriskColor
  }
}))

export const FieldWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '1.5rem'
})

export const StyledTextarea = styled((props: TextareaAutosizeProps) => <TextareaAutosize {...props} minRows={3} />)(
  ({ theme }) => ({
    background: theme.palette.secondary.main,
    color: theme.palette.light.light,
    fontFamily: 'inherit',
    padding: '0.5rem',
    outline: 'none',
    maxWidth: '100%',
    maxHeight: '10rem',
    fontSize: '1rem'
  })
)

export const ActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '0.5rem',
  marginBottom: '0.5rem',
  '& .btn': {
    flex: 1,
    '&.Mui-disabled': {
      background: theme.palette.secondary.light,
      color: 'grey'
    }
  }
}))

export const SwitchControl = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  margin: '0 0.5rem',
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.decorate.main,
        opacity: 1,
        border: 0
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff'
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100]
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.secondary.light,
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}))
