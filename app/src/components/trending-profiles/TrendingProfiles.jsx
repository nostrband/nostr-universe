import React, { useContext } from 'react'
import { TrendingProfileItem } from './TrendingProfileItem'
import { AppContext } from '../../store/app-context'

export const TrendingProfiles = () => {
	const contextData = useContext(AppContext)
	const { trendingProfiles = [] } = contextData || {}

	const renderedProfiles =
		trendingProfiles && trendingProfiles?.length ? trendingProfiles : []

	const onProfileClick = (npub) => {
		console.log('show', npub)
	}

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
