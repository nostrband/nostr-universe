import React from 'react'
import { AppItem } from './AppItem'

export const AppsList = ({ apps, onOpenApp }) => {
	return (
		<div>
			<h3 className='ps-3'>Apps</h3>
			<section className='container d-flex align-items-start'>
				<div className='contentWrapper d-flex gap-4'>
					{apps.map((app, index) => {
						return (
							<AppItem
								app={app}
								onOpenApp={onOpenApp}
								key={app.title + index}
							/>
						)
					})}
				</div>
			</section>
		</div>
	)
}
