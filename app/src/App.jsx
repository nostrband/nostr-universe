import { nip19 } from 'nostr-tools';
import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import './App.css';

import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import { BsFillPersonFill } from "react-icons/bs";
import { MdOutlineDone } from "react-icons/md";

import { Modal } from './components/ModalWindow';
import { IconBtn } from './components/iconBtn';
import coracleIcon from './icons/coracle.png';
import irisIcon from './icons/iris.png';
import nostrIcon from './icons/nb.png';
import satelliteIcon from './icons/satellite.png';
import snortIcon from './icons/snort.png';

const apps = [{ title: 'Nostr', img: nostrIcon, link: 'https://nostr.band/' },
{ title: 'Snort', img: snortIcon, link: 'https://snort.social/' },
{ title: 'Iris', img: irisIcon, link: 'https://iris.to/' },
{ title: 'Coracle', img: coracleIcon, link: 'https://coracle.social/' },
{ title: 'Satellite', img: satelliteIcon, link: 'https://satellite.earth/' }];



const App = () => {
  const [npub, setNpub] = useState('');
  const [modalActive, setModalActive] = useState(false);
  const [keys, setKeys] = useState();
  const [openKey, setOpenKey] = useState();
  const [list, setList] = useState();
  const ref = useRef();

  function getListKeys() {
    return new Promise((resolve, reject) => {
      cordova.plugins.NostrKeyStore.listKeys(
        function (res) {
          resolve(res)
        },
        function (error) {
          reject(error)
        }
      )
    })
  }

  useEffect(async () => {
    document.addEventListener("deviceready", onDeviceReady, false)

    async function onDeviceReady() {
      console.log('device ready');
      const list = await getListKeys();
      if (list.currentAlias) {
        const currentKey = nip19.npubEncode(list.currentAlias).replace(/"/g, '');
        setNpub(currentKey);
        setList(list);
        const keys = Object.keys(list).filter((key) => key !== 'currentAlias');
        if (keys.length) {
          setKeys(keys)
        }
      }
    }
  }, [])

  const addKey = async () => {
    const key = await promiseAddKey();
    const list = await getListKeys();

    if (key) {
      console.log('addKey', JSON.stringify(key))
      const list = await getListKeys();
      if (list.currentAlias) {
        const currentKey = nip19.npubEncode(list.currentAlias).replace(/"/g, '');
        setList(list);
        if (currentKey !== npub) {
          setNpub(currentKey);
        }
        const keys = Object.keys(list).filter((key) => key !== 'currentAlias');
        if (keys.length) {
          setKeys(keys)
        }
      }
    }
    console.log(JSON.stringify(list))

  }

  function promiseAddKey() {
    return new Promise((resolve, reject) => {
      cordova.plugins.NostrKeyStore.addKey(
        function (res) {
          console.log('res', JSON.stringify(res))
          resolve(res)
        },
        function (error) {
          console.log('err', JSON.stringify(error))
          reject(error)
        }
      )
    })
  }

  const open = async (url) => {
    var ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes');

    ref.addEventListener('loadstop', async () => {

      function startMethod(msg) {
        const id = Date.now().toString();
        window.nostrCordovaPlugin.requests[id] = {};
        let method = '';
        let params = '';

        if (msg) {
          method = "signEvent"
          params = msg;
        } else {
          method = "getPublicKey"
        }

        return new Promise(function (ok, err) {
          window.nostrCordovaPlugin.requests[id] = {
            res: ok,
            rej: err
          }
          webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify({ method, id, params }));
        });
      }

      ref.executeScript({
        code: `window.nostrCordovaPlugin = { requests: {} }; 
        const nostrKey = {getPublicKey: ${startMethod}, signEvent: ${startMethod}}; 
        window.nostr = nostrKey;`
      }, function () {
        console.log('script injected window nostr');
      });
    });


    ref.addEventListener('message', async (params) => {
      const id = params.data.id.toString();
      const method = params.data.method;
      const err = new Error(`New error in ${method} method`);
      const reply = await window.nostr[method](params.data.params);
      if (method === 'getPublicKey') {
        let npub = nip19.npubEncode(reply);
        setNpub(npub.replace(/"/g, ''))
      }
      const jsonReply = JSON.stringify(reply);

      const code = `const req = window.nostrCordovaPlugin.requests[${id}]; 
      if (${jsonReply}) {
        req.res(${jsonReply}); 
      } else {
        req.rej(${JSON.stringify(err)});
      };
      delete window.nostrCordovaPlugin.requests[${id}];
      `;

      ref.executeScript({ code }, function () {
        console.log(`script injected ${method}`);
      });

      console.log("message received: " + JSON.stringify(params.data))
    })

  }

  const editBtnClick = (ev) => {
    const index = ev.target.dataset.key;
    setOpenKey(keys[index])
    setModalActive(true)
  }

  async function copyKey() {
    const text = nip19.npubEncode(list[openKey].publicKey);
    cordova.plugins.clipboard.copy(text, (val) => alert(val));
  }

  const showKey = async () => {
    const key = await promiseShowKey({ publicKey: openKey })
  }

  function promiseShowKey(msg) {
    return new Promise((resolve, reject) => {
      cordova.plugins.NostrKeyStore.showKey(
        function (res) {
          resolve(res)
        },
        function (error) {
          reject(error)
        },
        msg
      )
    })
  }

  const selectKey = async (ind) => {
    const key = keys[ind];
    const res = await promiseSelectKey({ publicKey: key })
    if (res) {
      if (list.currentAlias) {
        const currentKey = nip19.npubEncode(res.currentAlias).replace(/"/g, '');
        setNpub(currentKey);
        setList(res);
        const keys = Object.keys(res).filter((key) => key !== 'currentAlias');
        if (keys.length) {
          setKeys(keys)
        }
      }
    }

  }

  function promiseSelectKey(msg) {
    return new Promise((resolve, reject) => {
      cordova.plugins.NostrKeyStore.selectKey(
        function (res) {
          resolve(res)
        },
        function (error) {
          reject(error)
        },
        msg
      )
    })
  }

  const editKey = async () => {
    const keysList = await promiseEditKey({ publicKey: openKey, name: ref.current.value })

    if (keysList) {
      setList(keysList);
      const keys = Object.keys(keysList).filter((key) => key !== 'currentAlias');
      if (keys.length) {
        setKeys(keys)
      }
    }
  }

  function promiseEditKey(msg) {
    return new Promise((resolve, reject) => {
      cordova.plugins.NostrKeyStore.editKey(
        function (res) {
          resolve(res)
        },
        function (error) {
          reject(error)
        },
        msg
      )
    })
  }


  return (
    <>
      <style type="text/css">
        {`
    .btn-primary {
      --bs-btn-bg: none;
      --bs-btn-active-bg: none;
      --bs-btn-border-color: none;
      --bs-btn-hover-bg: none;
      --bs-btn-hover-border-color: none;
      --bs-btn-focus-shadow-rgb: 60,153,110;
      --bs-btn-disabled-bg: none;
      --bs-btn-disabled-border-color: none;
      font-size: 1.5rem;
    }
    .dropdown-menu {
      --bs-dropdown-link-active-bg: none;
      --bs-dropdown-min-width: 80vw;
    }
    `}
      </style>
      <header className="container d-flex align-items-center justify-content-between" style={{ padding: '10px' }}>
        <BsFillPersonFill color='white' size={35} />
        <Dropdown data-bs-theme="dark"
          drop='down-centered'>
          <Dropdown.Toggle id="dropdown-basic"
          >
            {npub ? npub.substring(0, 10) + "..." + npub.substring(59) : 'Key is not chosen'}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {keys && keys.length && keys.map((key) => nip19.npubEncode(key).replace(/"/g, '')).map((key, ind) => {
              return (<Dropdown.Item href={`#/${key + 1}`} className='d-flex align-items-center gap-4'>
                <BsFillPersonFill color='white' size={35} />
                <div className='fs-3 text-white flex-grow-1' onClick={() => selectKey(ind)}>{key.substring(0, 10) + "..." + key.substring(59)}</div>
                <div onClick={editBtnClick} data-key={ind}>
                  <BiSolidPencil color='white' size={26} className=' pe-none ' />
                </div>
              </Dropdown.Item>)
            })}
            {keys && <Dropdown.Divider />}
            <Dropdown.Item href="#/action-15" className=' d-flex justify-content-center  '>
              <Button variant="secondary" size="lg" onClick={addKey}>+ Add keys</Button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <AiOutlineSearch color='white' size={35} onClick={() => console.log('search')} />
      </header>
      <hr className='m-0' />
      <div className="wrapper">
        <section className='section'>
          <h3>Apps</h3>
          <div className='contentWrapper'>
            {apps.map((app) => <IconBtn key={app.title} data={app} onClick={() => open(app.link)} />)}
          </div>
        </section>
      </div>
      <Modal activeModal={modalActive} setActive={setModalActive}>
        {modalActive && (<div>
          <div className='modalTitle'>
            <h2>Edit key</h2>
            <AiOutlineClose color='white' size={30} onClick={() => setModalActive(false)} />
          </div>
          <div className='modalKey'>
            {nip19.npubEncode(list[openKey].publicKey).replace(/"/g, '')}
          </div>
          <div className='modalBtnWrapper'>
            <Button variant="secondary" size="lg" onClick={copyKey}>Copy</Button>
            <Button variant="secondary" size="lg" onClick={showKey}>Show secret</Button>
          </div>
          <div>
            <h2 className='modalTitle'>Attributes</h2>
          </div>
          <div className='attributeWrapper'>
            <span>Name: </span>
            <input type='text' ref={ref} defaultValue={list[openKey].name} />
            <button className='editBtn' onClick={editKey}>
              <MdOutlineDone color='white' size={20} className='iconDropDown' />
            </button>
          </div>
          <div>
            <h2 className='modalTitle'>Profile</h2>
          </div>
        </div>
        )}
      </Modal >
    </>
  );
};

export default App;
