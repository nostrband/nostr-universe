import React from 'react'
import { Modal } from '../UI/modal/Modal'
import { EditKey } from './EditKey'

export const EditKeyModal = ({ isOpen, onClose }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<EditKey onCloseModal={onClose} />
		</Modal>
	)
}
