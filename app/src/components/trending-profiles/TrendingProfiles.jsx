import React from 'react'
import { TrendingProfileItem } from './TrendingProfileItem'

export const TrendingProfiles = ({ profiles = [], onProfileClick }) => {
	const renderedProfiles = profiles && profiles?.length ? profiles : []

	return (
		<div className='container-fluid p-1'>
			<h3>Trending profiles</h3>
			<div className='d-flex flex-row flex-nowrap overflow-auto'>
				{renderedProfiles.map((p) => (
					<TrendingProfileItem
						key={p.npub}
						profile={p}
						onClick={onProfileClick}
					/>
				))}
			</div>
		</div>
	)
}
