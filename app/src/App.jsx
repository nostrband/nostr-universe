import { nip19 } from 'nostr-tools'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import { browser } from './browser'
import { config } from './config'
import { addTabToDB, db, deleteTabDB, listTabs, updateTabDB } from './db'
import { keystore } from './keystore'

import { AiOutlineClose } from 'react-icons/ai'
import { BsArrowRightCircle } from 'react-icons/bs'

import { EditKey } from './components/EditKey'
import { Input } from './components/Input'
import { Modal } from './components/UI/modal/Modal'
import {
	nostrIcon,
	coracleIcon,
	irisIcon,
	satelliteIcon,
	snortIcon,
} from './assets'
import Header from './layout/Header'
import { TrendingProfiles } from './components/trending-profiles/TrendingProfiles'
import { AppsList } from './components/apps/AppsList'
import { Footer } from './layout/Footer'

const apps = [
	{ title: 'Nostr', img: nostrIcon, link: 'https://nostr.band/' },
	{ title: 'Snort', img: snortIcon, link: 'https://snort.social/' },
	{ title: 'Iris', img: irisIcon, link: 'https://iris.to/' },
	{ title: 'Coracle', img: coracleIcon, link: 'https://coracle.social/' },
	{
		title: 'Satellite',
		img: satelliteIcon,
		link: 'https://satellite.earth/',
	},
	{
		title: 'Zapddit',
		img: 'https://zapddit.com/assets/icons/logo-without-text-zapddit.svg',
		link: 'https://zapddit.com/',
	},
	{
		title: 'Agora',
		img: 'https://agorasocial.app/images/favicon/120.png',
		link: 'https://agorasocial.app/',
	},
	{
		title: 'Pinstr',
		img: 'https://pinstr.app/favicon.ico',
		link: 'https://pinstr.app/',
	},
	{
		title: 'Nosta',
		img: 'https://nosta.me/images/apple-icon-120x120.png',
		link: 'https://nosta.me/',
	},
	{
		title: 'NostrApp',
		img: 'https://nostrapp.link/logo.png',
		link: 'https://nostrapp.link/',
	},
]

export const getNpubKey = (key) => {
	return nip19.npubEncode(key)
}

const API = {
	setUrl: async function (tab, url) {
		if (tab) {
			console.log('tab', tab.id, 'setUrl', url)
			tab.url = url
			await updateTabDB(tab)
		}
	},
	decodeBech32: function (tab, s) {
		return nip19.decode(s)
	},
}

const App = () => {
	const [npub, setNpub] = useState('')
	const [modalActive, setModalActive] = useState(false)
	const [isOpenSearch, setIsOpenSearch] = useState(false)
	const [keys, setKeys] = useState()
	const [openKey, setOpenKey] = useState()
	const [list, setList] = useState()
	const [tabs, setTabs] = useState([])
	const [trendingProfiles, setTrendingProfiles] = useState()
	const inputSearchRef = useRef()
	const [nostrTabs, setNostrTabs] = useState([])
	const [otherTabs, setOtherTabs] = useState([])
	const [openedTab, setOpenedTab] = useState()

	const nostrAppsLinks = apps.map((app) => app.link)

	const openTabsFromDB = async (list) => {
		if (list) {
			const orderedList = [...list].sort(
				(prev, next) => next.order - prev.order,
			)

			//orderedList.forEach(async (tab) => { await openTab(tab, /* hidden */true); });

			const otherTabsList = orderedList.filter(
				(tab) => !nostrAppsLinks.includes(tab.url),
			)
			const nostrTabsList = orderedList.filter((tab) =>
				nostrAppsLinks.includes(tab.url),
			)
			setOtherTabs([...otherTabsList])
			setNostrTabs([...nostrTabsList])
			setTabs([...orderedList])
		}
	}

	useEffect(() => {
		async function fetchTrendingProfiles() {
			const r = await fetch('https://api.nostr.band/v0/trending/profiles')
			const tpr = await r.json()
			const tp = tpr.profiles.map((p) => {
				try {
					const pr = JSON.parse(p.profile.content)
					pr.npub = getNpubKey(p.pubkey)
					return pr
				} catch (e) {
					console.log('failed to parse profile', e)
					return undefined
				}
			})
			if (tp.length > 10) tp.length = 10
			setTrendingProfiles(tp)
		}

		async function onDeviceReady() {
			console.log('device ready')
			const list = await keystore.listKeys()

			if (list.currentAlias) {
				const currentKey = getNpubKey(list.currentAlias)
				setNpub(currentKey)
				setList(list)
				const keys = Object.keys(list).filter(
					(key) => key !== 'currentAlias',
				)

				if (keys.length) {
					setKeys(keys)
				}
			}

			const currentAlias = list.currentAlias
				? list.currentAlias
				: 'without publicKey'
			const tabsList = await listTabs(currentAlias)
			const isExistNostrLink = tabsList.some((tab) =>
				nostrAppsLinks.includes(tab.app.link),
			)

			if (!isExistNostrLink) {
				const tabs = []

				apps.forEach((app, ind) => {
					const tab = {
						id: '' + Math.random(),
						app,
						url: app.link,
						order: apps.length - ind,
						publicKey: currentAlias,
					}
					tabs.push(tab)
				})
				await db.tabsList.bulkAdd(tabs)

				const tabsList = await listTabs(currentAlias)
				openTabsFromDB(tabsList)
				return
			}
			openTabsFromDB(tabsList)

			await fetchTrendingProfiles()
		}

		if (config.DEBUG) onDeviceReady()
		else document.addEventListener('deviceready', onDeviceReady, false)
	}, [])

	const addKey = async () => {
		const key = await keystore.addKey()

		if (key) {
			const listKeys = await keystore.listKeys()

			if (!list && listKeys.currentAlias) {
				const tabs = await db.tabsList
					.where('publicKey')
					.equals('without publicKey')
					.toArray()
				tabs.forEach(async (tab) => {
					await db.tabsList.update(tab.id, {
						publicKey: listKeys.currentAlias,
					})
				})
			}

			if (listKeys.currentAlias) {
				const currentKey = getNpubKey(listKeys.currentAlias)
				setList(listKeys)

				if (currentKey !== npub) {
					setNpub(currentKey)
				}

				const keys = Object.keys(listKeys).filter(
					(key) => key !== 'currentAlias',
				)

				if (keys.length) {
					setKeys(keys)
				}

				const tabsList = await listTabs(listKeys.currentAlias)
				openTabsFromDB(tabsList)
			}
		}
	}

	const openTab = async (tab, hidden) => {
		const params = {
			url: tab.url,
			hidden,
			API,
			apiCtx: tab,
			onLoadStop: async (event) => {
				tab.url = event.url
				await updateTabDB(tab)
			},
			onGetPubkey: (pubkey) => {
				let npub = nip19.npubEncode(pubkey)
				console.log('npub', npub)
				setNpub(npub)
			},
			onClick: (x, y) => {
				console.log('click', x, y)
				hide(tab)
				document.elementFromPoint(x, y).click()
			},
			onHide: () => {
				setOpenedTab(null)
			},
			onMenu: async () => {
				console.log('menu click tab', tab.id)
				//	browser.showMenu(tab.ref);
				//	return;

				// FIXME just for now a hack to close a tab
				// close & remove tab
				await deleteTabDB(tab.id)
				tab.ref.close()
				setOpenedTab(null)
				setTabs((prev) => prev.filter((t) => t.id !== tab.id))
				if (nostrAppsLinks.includes(tab.app.link)) {
					setNostrTabs((prev) => prev.filter((t) => t.id !== tab.id))
				}
				if (!nostrAppsLinks.includes(tab.app.link)) {
					setOtherTabs((prev) => prev.filter((t) => t.id !== tab.id))
				}
			},
			onBlank: (url) => {
				hide(tab)
				open(url)
			},
		}

		// open the browser
		tab.ref = await browser.open(params)
	}

	const hide = (tab) => {
		tab.ref.hide()
		setOpenedTab(null)
	}

	const show = async (tab) => {
		if (!tab.ref) await openTab(tab, /* hidden */ false)
		else tab.ref.show()
		setOpenedTab(tab.id)
	}

	const toggle = (tab) => {
		console.log('toggle', tab.id, openedTab)
		if (tab.id === openedTab) {
			hide(tab)
		} else {
			show(tab)
		}
	}

	const open = async (url, app, hidden) => {
		const hiddenNostrTab = nostrTabs.find((tab) => tab.app.link === url)
		if (hiddenNostrTab) {
			show(hiddenNostrTab)
			return
		}

		const hiddenOtherTab = otherTabs.find((tab) => tab.app.link === url)

		if (hiddenOtherTab) {
			show(hiddenOtherTab)
			return
		}

		if (!app)
			app = {
				link: url,
				title: new URL(url).hostname,
			}

		console.log('open', url, JSON.stringify(app))
		const tab = {
			id: '' + Math.random(),
			app,
			url,
			order: tabs.length + 1,
			ref: null, // filled below
		}

		await openTab(tab)
		setOpenedTab(tab.id)
		setTabs((prev) => [tab, ...tabs])

		if (nostrAppsLinks.includes(tab.app?.link)) {
			setNostrTabs(() => [tab, ...nostrTabs])
		}
		if (!nostrAppsLinks.includes(tab.app?.link)) {
			setOtherTabs(() => [tab, ...otherTabs])
		}

		await addTabToDB(tab, list)
	}

	const editBtnClick = (ev) => {
		const index = ev.target.dataset.key
		setOpenKey(keys[index])
		setModalActive(true)
	}

	async function copyKey() {
		const text = getNpubKey(list[openKey].publicKey)
		// eslint-disable-next-line
		cordova.plugins.clipboard.copy(text)
	}

	const showKey = async () => {
		await keystore.showKey({ publicKey: openKey })
	}

	const selectKey = async (ind) => {
		const key = keys[ind]
		const res = await keystore.selectKey({ publicKey: key })

		if (res) {
			if (res.currentAlias && res.currentAlias !== list.currentAlias) {
				const currentKey = getNpubKey(res.currentAlias)
				setNpub(currentKey)
				setList(res)
				const keys = Object.keys(res).filter(
					(key) => key !== 'currentAlias',
				)

				if (keys.length) {
					setKeys(keys)
				}
			}

			const tabsList = await listTabs(res.currentAlias)
			openTabsFromDB(tabsList)
		}
	}

	const editKey = async (keyInfoObj) => {
		const keysList = await keystore.editKey(keyInfoObj)

		if (keysList) {
			setList(keysList)
			const keys = Object.keys(keysList).filter(
				(key) => key !== 'currentAlias',
			)

			if (keys.length) {
				setKeys(keys)
			}
		}
	}

	const closeModal = () => {
		setIsOpenSearch(false)
		inputSearchRef.current.focus()
	}

	const handleClickSearchBtn = () => {
		const url = new URL('/', inputSearchRef.current.value)

		if (url) {
			const title = url.hostname
			const link = inputSearchRef.current.value + '/'
			const img = inputSearchRef.current.value + '/' + '/favicon.ico'
			const app = { title, img, link }
			open(link, app)
			closeModal()
		}
	}

	const submitSearchInput = (ev) => {
		ev.preventDefault()
		handleClickSearchBtn()
	}

	const onProfileClick = (npub) => {
		console.log('show', npub)
	}

	return (
		<>
			<Header
				npub={npub}
				keys={keys}
				onAddKey={addKey}
				onEditKey={editBtnClick}
				onOpenSearchModal={() => setIsOpenSearch(true)}
				onSelectKey={selectKey}
			/>
			<main>
				<button onClick={() => db.delete()}>Delete DB</button>
				<TrendingProfiles
					profiles={trendingProfiles}
					onProfileClick={onProfileClick}
				/>

				{true && <AppsList apps={apps} onOpenApp={open} />}

				<Modal
					isOpen={modalActive}
					onClose={() => setModalActive(false)}
				>
					{list && (
						<EditKey
							keyProp={list[openKey]}
							copyKey={copyKey}
							showKey={showKey}
							editKey={editKey}
							setModalActive={setModalActive}
						/>
					)}
				</Modal>
				<Modal isOpen={isOpenSearch} onClose={closeModal}>
					<div className='d-flex flex-column'>
						<div className='d-flex justify-content-end align-items-center p-3 mb-5 '>
							<AiOutlineClose
								color='white'
								size={30}
								onClick={closeModal}
							/>
						</div>
						<form
							className='d-flex px-3 gap-3 align-items-center align-self-center '
							onSubmit={submitSearchInput}
						>
							<Input ref={inputSearchRef} />
							<BsArrowRightCircle
								color='white'
								size={30}
								className='iconDropDown'
								onClick={handleClickSearchBtn}
							/>
						</form>
					</div>
				</Modal>
			</main>
			<Footer
				activeTab={openedTab}
				nostrTabs={nostrTabs}
				onToggleTab={toggle}
				tabs={otherTabs}
			/>
		</>
	)
}

export default App
