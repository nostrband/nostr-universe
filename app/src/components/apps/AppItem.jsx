import React from 'react'
import { IconButton } from '../IconButton'

export const AppItem = ({ app, onOpenApp }) => {
	return (
		<IconButton
			key={app.link}
			data={app}
			size='big'
			onClick={() => onOpenApp(app.link, app)}
		/>
	)
}