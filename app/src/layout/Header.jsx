import React, { useContext } from 'react'
import { nip19 } from 'nostr-tools'
import Dropdown from 'react-bootstrap/Dropdown'
import { BsFillPersonFill } from 'react-icons/bs'
import { BiSolidPencil } from 'react-icons/bi'
import Button from 'react-bootstrap/Button'
import { AiOutlineSearch } from 'react-icons/ai'
import { getShortenText } from '../utils/helpers/general'
import { AppContext } from '../store/app-context'

const getRenderedKeys = (keys) => {
	if (!keys || keys.length === 0) {
		return []
	}
	return keys.map((key) => nip19.npubEncode(key))
}

export const Header = ({ onOpenSearchModal, onOpenEditKeyModal }) => {
	const contextData = useContext(AppContext)

	const { npub, keys, onAddKey, onSelectKey, setOpenKey } = contextData || {}

	const renderedKeys = getRenderedKeys(keys)

	const editKeyHandler = (index) => {
		onOpenEditKeyModal()
		setOpenKey(keys[index])
	}

	return (
		<header id='header'>
			<div className='container d-flex align-items-center justify-content-between'>
				<BsFillPersonFill color='white' size={35} />
				<Dropdown data-bs-theme='dark' drop='down-centered'>
					<Dropdown.Toggle id='dropdown-basic' variant='secondary'>
						{npub ? getShortenText(npub) : 'Key is not chosen'}
					</Dropdown.Toggle>

					<Dropdown.Menu>
						{renderedKeys.map((key, index) => {
							return (
								<Dropdown.Item
									key={key}
									href={`#/${key + 1}`}
									className='d-flex align-items-center gap-4'
								>
									<BsFillPersonFill color='white' size={35} />
									<div
										className='fs-3 text-white flex-grow-1'
										onClick={() => onSelectKey(index)}
									>
										{getShortenText(key)}
									</div>
									<div onClick={() => editKeyHandler(index)}>
										<BiSolidPencil
											color='white'
											size={26}
											className=' pe-none '
										/>
									</div>
								</Dropdown.Item>
							)
						})}
						{renderedKeys && <Dropdown.Divider />}
						<Dropdown.Item
							href='#/action-15'
							className=' d-flex justify-content-center  '
						>
							<Button
								variant='secondary'
								size='lg'
								onClick={onAddKey}
							>
								+ Add keys
							</Button>
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>

				<AiOutlineSearch
					color='white'
					size={35}
					onClick={onOpenSearchModal}
				/>
			</div>
			<hr className='m-0' />
		</header>
	)
}
