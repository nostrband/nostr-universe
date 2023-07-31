import React, { useContext, useRef } from 'react'
import { Modal } from '../UI/modal/Modal'
import { AiOutlineClose } from 'react-icons/ai'

import { BsArrowRightCircle } from 'react-icons/bs'
import { AppContext } from '../../store/app-context'
import { Input } from '../UI/Input'

export const SearchModal = ({ isOpen, onClose }) => {
	const { open } = useContext(AppContext)

	const inputSearchRef = useRef()

	const handleClickSearchBtn = () => {
		const url = new URL('/', inputSearchRef.current.value)
		if (url) {
			const url = inputSearchRef.current.value
			open(url)
			onClose()
		}
	}

	const submitSearchInput = (ev) => {
		ev.preventDefault()
		handleClickSearchBtn()
	}
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<div className='d-flex flex-column'>
				<div className='d-flex justify-content-end align-items-center p-3 mb-5 '>
					<AiOutlineClose color='white' size={30} onClick={onClose} />
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
	)
}
