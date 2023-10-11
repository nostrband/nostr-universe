import { SearchHistory } from '@/modules/types/db'
import {
  styled,
  InputBase,
  Autocomplete,
  AutocompleteProps,
  IconButton,
  ThemeProvider,
  createTheme,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { theme } from '@/modules/theme/theme'
import HistoryIcon from '@mui/icons-material/History'
import CloseIcon from '@mui/icons-material/Close'

export const StyledForm = styled('form')(() => ({
  marginBottom: 15
}))

const commonStyles = {
  color: theme.palette.light.light,
  fontFamily: 'inherit',
  fontWeight: '700'
}

const autoCompleteTheme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          background: theme.palette.secondary.dark,
          borderRadius: theme.shape.borderRadius,
          ...commonStyles
        },
        paper: {
          background: theme.palette.secondary.dark,
          ...commonStyles
        },
        loading: {
          ...commonStyles,
          textAlign: 'center'
        },
        noOptions: {
          ...commonStyles,
          textAlign: 'center',
          '&.hidden': {
            display: 'none'
          }
        },
        inputRoot: {
          background: theme.palette.secondary.main,
          borderRadius: theme.shape.borderRadius,
          width: '100%',
          minHeight: 50,
          color: '#fff',
          fontSize: 14,
          padding: '4px 16px',
          '&:placeholder': {
            color: '#C9C9C9'
          },
          gap: '0.5rem'
        }
      }
    }
  }
})

const StyledListItemIcon = styled(ListItemIcon)({
  color: 'white',
  minWidth: '2.5rem'
})

const StyledListItem = styled(ListItem)({
  '& .text > span': commonStyles
})

export const StyledAutoComplete = styled(
  ({
    onOptionDelete,
    ...props
  }: Omit<AutocompleteProps<SearchHistory, false, true, false>, 'renderInput'> & {
    onOptionDelete: (option: SearchHistory) => void
  }) => (
    <ThemeProvider theme={autoCompleteTheme}>
      <Autocomplete<SearchHistory, false, true, false>
        {...props}
        disableClearable
        clearOnBlur={false}
        renderInput={(params) => {
          return (
            <InputBase
              placeholder="Search"
              inputProps={{
                ...params.inputProps
              }}
              {...params.InputProps}
              endAdornment={
                <IconButton type="submit" color="inherit" size="medium">
                  <SearchOutlinedIcon />
                </IconButton>
              }
            />
          )
        }}
        getOptionLabel={(option) => option.value}
        classes={{
          noOptions: !props.noOptionsText ? 'hidden' : ''
        }}
        renderOption={(props, option) => (
          <StyledListItem
            {...props}
            secondaryAction={
              <IconButton
                edge="end"
                sx={{ color: 'white' }}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onOptionDelete(option)
                }}
              >
                <CloseIcon color="inherit" />
              </IconButton>
            }
          >
            <StyledListItemIcon>
              <HistoryIcon color="inherit" />
            </StyledListItemIcon>
            <ListItemText className="text">{option.value}</ListItemText>
          </StyledListItem>
        )}
      />
    </ThemeProvider>
  )
)({})
