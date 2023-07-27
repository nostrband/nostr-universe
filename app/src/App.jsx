import { nip19 } from 'nostr-tools'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import { browser } from './browser'
import { config } from './config'
import {
	addTab,
	db,
	deleteTab,
	getFlag,
	listPins,
	listTabs,
	setFlag,
	updateTab,
} from './db'
import { keystore } from './keystore'

import { AiOutlineClose } from 'react-icons/ai'
import { BsArrowRightCircle } from 'react-icons/bs'

// import { EditKey } from './components/EditKey'
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
	{
		naddr: '10',
		name: 'NostrApp',
		picture: 'https://nostrapp.link/logo.png',
		url: 'https://nostrapp.link/',
	},
	{
		naddr: '1',
		name: 'Nostr',
		picture: nostrIcon,
		url: 'https://nostr.band/',
	},
	{
		naddr: '2',
		name: 'Snort',
		picture: snortIcon,
		url: 'https://snort.social/',
	},
	{ naddr: '3', name: 'Iris', picture: irisIcon, url: 'https://iris.to/' },
	{
		naddr: '4',
		name: 'Coracle',
		picture: coracleIcon,
		url: 'https://coracle.social/',
	},
	{
		naddr: '5',
		name: 'Satellite',
		picture: satelliteIcon,
		url: 'https://satellite.earth/',
	},
	{
		naddr: '6',
		name: 'Zapddit',
		picture:
			'https://zapddit.com/assets/icons/logo-without-text-zapddit.svg',
		url: 'https://zapddit.com/',
	},
	{
		naddr: '7',
		name: 'Agora',
		picture: 'https://agorasocial.app/images/favicon/120.png',
		url: 'https://agorasocial.app/',
	},
	{
		naddr: '8',
		name: 'Pinstr',
		picture: 'https://pinstr.app/favicon.ico',
		url: 'https://pinstr.app/',
	},
	{
		naddr: '9',
		name: 'Nosta',
		picture: 'https://nosta.me/images/apple-icon-120x120.png',
		url: 'https://nosta.me/',
	},
]

export const getNpub = (key) => {
	return nip19.npubEncode(key)
}

const API = {
	setUrl: async function (tab, url) {
		if (tab) {
			console.log('tab', tab.id, 'setUrl', url)
			tab.url = url
			await updateTab(tab)
		}
	},
	decodeBech32: function (tab, s) {
		return nip19.decode(s)
	},
}

const DEFAULT_PUBKEY = 'anon'

const App = () => {
	//  const [npub, setNpub] = useState('');
	const [keys, setKeys] = useState()
	const [currentPubkey, setCurrentPubkey] = useState()

	const [pins, setPins] = useState([])
	const [tabs, setTabs] = useState([])
	const [currentTab, setCurrentTab] = useState(null)

	const [trendingProfiles, setTrendingProfiles] = useState()

	const inputSearchRef = useRef()

	// FIXME move to a separate page
	const [modalActive, setModalActive] = useState(false)
	const [isOpenSearch, setIsOpenSearch] = useState(false)
	const [openKey, setOpenKey] = useState()

	const loadKeys = async () => {
		const list = await keystore.listKeys()

		if (list.currentAlias) {
			setCurrentPubkey(list.currentAlias)
			const keys = Object.keys(list).filter(
				(key) => key !== 'currentAlias',
			)
			if (keys.length) {
				setKeys(keys)
			}
		}

		return list.currentAlias
	}

	const loadWorkspace = async (workspaceKey) => {
		const dbTabs = await listTabs(workspaceKey)
		const dbPins = await listPins(workspaceKey)

		setTabs(dbTabs)
		setPins(dbPins)
	}

	const bootstrap = async (pubkey) => {
		console.log('new workspace, bootstrapping')
		let pins = []
		apps.forEach((app, ind) => {
			const pin = {
				id: '' + Math.random(),
				url: app.url,
				appNaddr: app.naddr,
				title: app.name,
				icon: app.picture,
				order: ind,
				pubkey: pubkey,
			}
			pins.push(pin)
		})
		await db.pins.bulkAdd(pins)
	}

	const ensureBootstrapped = async (workspaceKey) => {
		if (!(await getFlag(workspaceKey, 'bootstrapped'))) {
			await bootstrap(workspaceKey)
			await setFlag(workspaceKey, 'bootstrapped', true)
		}
	}

	useEffect(() => {
		async function fetchTrendingProfiles() {
			const r = await fetch('https://api.nostr.band/v0/trending/profiles')
			const tpr = await r.json()
			const tp = tpr.profiles.map((p) => {
				try {
					const pr = JSON.parse(p.profile.content)
					pr.npub = getNpub(p.pubkey)
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

			const currentKey = await loadKeys()

			const workspaceKey = currentKey || DEFAULT_PUBKEY
			await ensureBootstrapped(workspaceKey)
			await loadWorkspace(workspaceKey)
			await fetchTrendingProfiles()
		}

		if (config.DEBUG) onDeviceReady()
		else document.addEventListener('deviceready', onDeviceReady, false)
	}, [])

	const addKey = async () => {
		await keystore.addKey()

		// reload the list
		const pubkey = await loadKeys()

		// reassign everything from default to the new key
		if (currentPubkey === DEFAULT_PUBKEY) {
			await db.tabs.where({ pubkey: DEFAULT_PUBKEY }).modify({ pubkey })
			await db.pins.where({ pubkey: DEFAULT_PUBKEY }).modify({ pubkey })
		}

		// make sure this key has default apps pinned
		await ensureBootstrapped(pubkey)

		// load new key's tabs etc
		await loadWorkspace(pubkey)
	}

	const createTab = async (tab) => {
		const params = {
			url: tab.url,
			hidden: true,
			API,
			apiCtx: tab,
			onLoadStop: async (event) => {
				tab.url = event.url
				await updateTab(tab)
			},
			onGetPubkey: (pubkey) => {
				if (pubkey !== currentPubkey) {
					let npub = nip19.npubEncode(pubkey)
					console.log('npub', npub)
					setCurrentPubkey(pubkey)
					// FIXME bootstrap etc, just remove it and start onboarding?
				}
			},
			onClick: (x, y) => {
				console.log('click', x, y)
				//	tab.ref.hide();
				//	hide(tab);
				document.elementFromPoint(x, y).click()
			},
			onMenu: async () => {
				console.log('menu click tab', tab.id)
				//	browser.showMenu(tab.ref);
				//	return;

				// FIXME just for now a hack to close a tab
				// close & remove tab
				close(tab)
			},
			onBlank: (url) => {
				hide(tab)
				open(url)
			},
		}

		// open the browser
		tab.ref = await browser.open(params)
	}

	const close = async (tab) => {
		hide(tab)

		await deleteTab(tab.id)
		tab.ref.close()

		setTabs((prev) => prev.filter((t) => t.id !== tab.id))
	}

	const hide = (tab) => {
		if (tab) {
			tab.ref.hide()
			setCurrentTab(tab)
		}

		document.getElementById('pins').classList.remove('d-none')
		document.getElementById('pins').classList.add('d-flex')
		document.getElementById('tab-menu').classList.remove('d-flex')
		document.getElementById('tab-menu').classList.add('d-none')
	}

	const showTabMenu = () => {
		document.getElementById('pins').classList.remove('d-flex')
		document.getElementById('pins').classList.add('d-none')
		document.getElementById('tab-menu').classList.remove('d-none')
		document.getElementById('tab-menu').classList.add('d-flex')
	}

	const show = async (tab) => {
		showTabMenu()

		return new Promise((ok) => {
			setTimeout(async () => {
				// schedule the open after task bar is changed
				if (!tab.ref) await createTab(tab)

				tab.ref.show()
				setCurrentTab(tab)
				ok()
			}, 0)
		})
	}

	const toggle = (tab) => {
		console.log('toggle', tab.id, currentTab)
		if (currentTab != null && tab.id === currentTab.id) {
			hide(tab)
		} else {
			show(tab)
		}
	}

	const open = async (url, pin) => {
		console.log('open', url)

		// make sure it's visible and has proper height
		showTabMenu()

		// schedule the open when tab menu is rendered
		setTimeout(async () => {
			const U = new URL(url)
			const title = U.hostname

			const tab = {
				id: '' + Math.random(),
				pubkey: currentPubkey,
				title: pin ? pin.title : title,
				icon: pin ? pin.icon : U.origin + '/favicon.ico',
				url,
				order: tabs.length + 1,
				ref: null, // filled below
			}
			if (pin) tab.appNaddr = pin.appNaddr
			console.log('open', url, JSON.stringify(pin), JSON.stringify(tab))

			await createTab(tab)

			await addTab(tab)

			await show(tab)

			setCurrentTab(tab)
			setTabs((prev) => [tab, ...tabs])
		}, 0)
	}

	const editBtnClick = (ev) => {
		const index = ev.target.dataset.key
		setOpenKey(keys[index])
		setModalActive(true)
	}

	async function copyKey() {
		const text = getNpub(openKey)
		// eslint-disable-next-line
		cordova.plugins.clipboard.copy(text)
	}

	const showKey = async () => {
		await keystore.showKey({ publicKey: openKey })
	}

	const selectKey = async (ind) => {
		const key = keys[ind]
		const res = await keystore.selectKey({ publicKey: key })

		if (res && res.currentAlias !== currentPubkey) {
			const pubkey = await loadKeys()
			await loadWorkspace(pubkey)
		}
	}

	const editKey = async (keyInfoObj) => {
		const keysList = await keystore.editKey(keyInfoObj)

		if (keysList) {
			await loadWorkspace(currentPubkey)
		}
	}

	const closeModal = () => {
		setIsOpenSearch(false)
		inputSearchRef.current.focus()
	}

	const handleClickSearchBtn = () => {
		const url = new URL('/', inputSearchRef.current.value)

		if (url) {
			const url = inputSearchRef.current.value
			open(url)
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

	const closeTab = () => {
		console.log('closeTab')
		close(currentTab)
	}

	const hideTab = () => {
		console.log('hideTab')
		hide(currentTab)
	}

	const showTabs = () => {}

	const pinTab = () => {
		// FIXME create pin and add
	}

	const npub = currentPubkey ? getNpub(currentPubkey) : ''

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
					{/* <EditKey
						keyProp={list[openKey]}
						copyKey={copyKey}
						showKey={showKey}
						editKey={editKey}
						setModalActive={setModalActive}
					/> */}
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
				onToggleTab={toggle}
				tabs={tabs}
				pins={pins}
				onCloseTab={closeTab}
				onHideTab={hideTab}
				onOpenPin={open}
				onPinTab={pinTab}
				onShowTabs={showTabs}
			/>
		</>
	)
}

export default App
