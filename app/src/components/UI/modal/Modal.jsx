import React from 'react'
import { Dialog, Slide } from '@mui/material'

const ModalContent = (props) => {
	return <div>{props.children}</div>
}

const Transition = React.forwardRef(function (props, ref) {
	return <Slide ref={ref} {...props} unmountOnExit />
})

export const Modal = ({
	isOpen = false,
	onClose,
	children,
	rootProps = {},
	fullScreen = true,
	direction = 'right',
	...props
}) => {
	return (
		<Dialog
			fullScreen={fullScreen}
			open={isOpen}
			onClose={onClose}
			TransitionComponent={fullScreen ? Transition : undefined}
			TransitionProps={{
				direction,
			}}
			keepMounted
			PaperProps={{
				sx: {
					background: '#000000',
					color: 'white',
				},
			}}
			{...rootProps}
		>
			<ModalContent {...props}>{children}</ModalContent>
		</Dialog>
	)
}
