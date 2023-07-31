import { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineDone } from 'react-icons/md';

export const PinApp = ({ app, close, savePin }) => {

  const [kinds, setKinds] = useState([]);
  const [perms, setPerms] = useState([]);

  useEffect(() => {
    setKinds(app.kinds);
    setPerms(app.kinds);
  }, [app]);
  
  const done = () => {
    savePin(app, perms);
    close();
  };

  const perm = (kind, on) => {
    if (on && !perms.find(k => k == kind))
      setPerms(prev => [kind, ...prev]);

    if (!on)
      setPerms(prev => prev.filter(k => k != kind));
  }
  
  return (
    <div className='d-flex flex-column'>
      <div className='d-flex justify-content-between align-items-center p-3'>
	<h2 className='m-0'>Pin app: {app.name}</h2>
	<AiOutlineClose color='white' size={30} onClick={close} />
      </div>
      <hr className='m-0' />
      <div className='m-3'>
	<h3>Permissions:</h3>
	<div className='d-flex p-3 justify-content-between align-items-center'>
          <Form>
	    {kinds.map(k =>
              <Form.Check
		type="switch"
		label={`Kind ${k}`}
		checked={perms.find(kd => k == kd) !== undefined}
		onChange={(e) => perm(k, e.target.checked)}
              />
	    )}
	  </Form>
	</div>
	<MdOutlineDone color='white' size={30} className='iconDropDown' onClick={done}>
	  Pin
	</MdOutlineDone>
      </div>
    </div>
  )
}
