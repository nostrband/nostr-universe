import { Route, Routes } from 'react-router-dom'
import { MainPage } from '@/pages/MainPage/MainPage'

export const App = () => {
  return (
    <>
      <Routes>
        <Route index path="/" element={<MainPage />} />
        <Route path="*" element={<MainPage />} />
      </Routes>
    </>
  )
}
