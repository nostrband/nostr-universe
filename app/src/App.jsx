import { useState } from 'react'
import { db } from './db'
import { Header } from './layout/Header'
import { TrendingProfiles } from './components/trending-profiles/TrendingProfiles'
import { AppsList } from './components/apps/AppsList'
import { Footer } from './layout/Footer'
import { SearchModal } from './components/search-modal/SearchModal'
import { EditKeyModal } from './components/edit-key-modal/EditKeyModal'
import './App.css'

const App = () => {
	const [isSearchModalVisible, setIsSearchModalVisible] = useState(false)
	const toggleSearchModalVisibility = () => {
		setIsSearchModalVisible((prevState) => !prevState)
	}

	const [isEditKeyModalVisible, setIsEditKeyModalVisible] = useState(false)
	const toggleEditKeyModalVisibility = () => {
		setIsEditKeyModalVisible((prevState) => !prevState)
	}

	return (
		<>
			<Header
				onOpenSearchModal={toggleSearchModalVisibility}
				onOpenEditKeyModal={toggleEditKeyModalVisibility}
			/>
			<main>
				<button onClick={() => db.delete()}>Delete DB</button>

				<TrendingProfiles />

				{true && <AppsList />}

				<EditKeyModal
					isOpen={isEditKeyModalVisible}
					onClose={toggleEditKeyModalVisibility}
				/>

				<SearchModal
					isOpen={isSearchModalVisible}
					onClose={toggleSearchModalVisibility}
				/>
			</main>
			<Footer />
		</>
	)
}

export default App
