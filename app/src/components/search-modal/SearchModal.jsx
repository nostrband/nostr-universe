import React, { useRef } from 'react'
import { Modal } from '../UI/modal/Modal'
import { AiOutlineClose } from 'react-icons/ai'

import { BsArrowRightCircle } from 'react-icons/bs'
import { Input } from '../UI/Input'

export const SearchModal = ({ isOpen, onClose, onSearch }) => {

  const inputSearchRef = useRef()

  const handleClickSearchBtn = () => {
    const str = inputSearchRef.current.value
    if (onSearch(str))
      onClose()
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
	<div className='d-flex px-3 justify-content-center'>
	  <form
	    onSubmit={submitSearchInput}
	  >
	    <Input ref={inputSearchRef} />
	  </form>
	</div>
	<center className="m-3">
	  <BsArrowRightCircle
	    color='white'
	    size={30}
	    className='iconDropDown'
	    onClick={handleClickSearchBtn}
	  />
	</center>
      </div>
    </Modal>
  )
}
