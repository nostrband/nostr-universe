import { Route, Routes } from 'react-router-dom'
import { MainPage } from './pages/MainPage/MainPage'
import { ProfilePage } from './pages/ProfilePage/ProfilePage'
import { AppPinMenu } from './components/AppPinMenu/AppPinMenu'

export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>

      <AppPinMenu />
    </>
  )
}
