import { forwardRef, useEffect } from 'react'

export const Input = forwardRef(
	({ type = 'text', onChange, ...props }, ref) => {
		useEffect(() => {
			ref.current.focus()
		}, [ref])

		return (
			<input
				type={type}
				onChange={onChange}
				ref={ref}
				className=' fs-3 '
				{...props}
			/>
		)
	},
)
