import { Tab, TabProps, Tabs, TabsProps, Typography, TypographyProps, styled } from '@mui/material'
import { blue } from '@mui/material/colors'
import { forwardRef } from 'react'

export const StyledTab = styled((props: TabProps) => {
  return (
    <Tab
      {...props}
      classes={{
        selected: 'selected'
      }}
    />
  )
})(() => ({
  color: '#fff',
  textTransform: 'initial',
  background: '#272727',
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: '8px',
  padding: '0 12px',
  minWidth: '12px',
  height: '2rem',
  minHeight: '2rem',
  '&.selected': {
    background: '#f1f1f1',
    color: '#0f0f0f'
  }
}))

export const StyledTabs = styled((props: TabsProps) => (
  <Tabs
    {...props}
    variant="scrollable"
    scrollButtons={false}
    TabIndicatorProps={{
      style: { display: 'none', height: 0 }
    }}
    classes={{
      flexContainer: 'flex_container'
    }}
  />
))(() => ({
  minHeight: 'auto',
  paddingLeft: '1rem',
  '& .flex_container': {
    gap: '0.75rem'
  },
  marginBottom: '1rem'
}))

const color = blue[100]

export const StyledTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} variant="h5" gutterBottom />
  })
)(() => ({
  color: color,
  fontWeight: 'bold'
}))
