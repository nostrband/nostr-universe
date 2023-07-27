import React from 'react'
import { IconButton } from '../components/IconButton'
import { nostrIcon } from '../assets'

export const Footer = ({ tabs, nostrTabs, activeTab, onToggleTab }) => {
	return (
		<footer id='footer'>
			<hr className='m-0' />
			<div className='container d-flex align-items-center gap-2 p-1'>
				<div className='contentWrapper d-flex'>
					{tabs.map((tab, idx) => (
						<IconButton
							key={tab.app.title + idx}
							data={tab.app}
							size='small'
							openedTab={activeTab === tab.id}
							onClick={() => onToggleTab(tab)}
						/>
					))}
					<div
						style={{
							width: '2px',
							height: '50px',
							backgroundColor: '#706d6dd4',
						}}
					></div>
					{nostrTabs.map((tab, idx) => (
						<IconButton
							key={tab.app.title + idx}
							data={tab.app}
							size='small'
							openedTab={activeTab === tab.id}
							onClick={() => onToggleTab(tab)}
						/>
					))}
					<IconButton
						key='addApp'
						data={{ title: 'Add', img: nostrIcon }}
						size='small'
						onClick={() => console.log('add app')}
					/>
				</div>
			</div>
		</footer>
	)
}
