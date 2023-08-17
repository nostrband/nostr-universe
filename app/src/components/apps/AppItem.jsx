import React from 'react'
import { IconButton } from '../UI/IconButton'

export const AppItem = ({ app, onOpenApp }) => {
	return (
		<IconButton
		  key={app.url}
		  data={{ ...app, title: app.name, img: app.picture }}
		  size='big'
		  onClick={() => onOpenApp(app)}
		/>
	)
}
