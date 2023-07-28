import React, { useContext } from 'react'

import Button from 'react-bootstrap/esm/Button'
import { AppContext } from '../store/app-context'
import { IconButton } from '../components/UI/IconButton'

export const Footer = () => {
	const contextData = useContext(AppContext)
	const {
		tabs,
		onToggleTab,
		onCloseTab,
		onPinTab,
		onHideTab,
		onShowTabs,
		pins,
		open: onOpenPin,
	} = contextData || {}

	return (
		<footer id='footer'>
			<hr className='m-0' />
			<div
				id='pins'
				className='container d-flex align-items-center gap-2 p-1'
			>
				{pins.map((p) => (
					<IconButton
						key={p.name}
						data={{ ...p, img: p.icon }}
						size='small'
						onClick={() => onOpenPin(p.url, p)}
					/>
				))}
				{tabs.map((t) => (
					<IconButton
						key={t.id}
						data={{ ...t, img: t.icon }}
						size='small'
						onClick={() => onToggleTab(t)}
					/>
				))}
			</div>
			<div
				id='tab-menu'
				className='container d-none justify-content-end gap-1'
			>
				<div>
					<Button
						variant='secondary'
						size='small'
						onClick={onCloseTab}
					>
						Close
					</Button>
				</div>
				<div>
					<Button variant='secondary' size='small' onClick={onPinTab}>
						Pin
					</Button>
				</div>
				<div>
					<Button
						variant='secondary'
						size='small'
						onClick={onShowTabs}
					>
						Tabs
					</Button>
				</div>
				<div>
					<Button
						variant='secondary'
						size='small'
						onClick={onHideTab}
					>
						Hide
					</Button>
				</div>
			</div>
		</footer>
	)
}
