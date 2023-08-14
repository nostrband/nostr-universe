import { Outlet } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { TrendingProfiles } from './components/TrendingProfiles/TrendingProfiles'
import { AppsNostro } from './components/AppsNostro/AppsNostro'

export const MainContainer = () => {
  return (
    <>
      <Header />
      <TrendingProfiles />
      <AppsNostro />
      <Outlet />
    </>
  )
}
