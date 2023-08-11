import { Outlet } from 'react-router-dom'
import { Header } from '../../components/Header/Header'
import { TrendingProfiles } from '../../components/TrendingProfiles/TrendingProfiles'

export const MainPage = () => {
  return (
    <>
      <Header />
      <TrendingProfiles />
      <Outlet />
    </>
  )
}
