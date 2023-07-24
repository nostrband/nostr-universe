import { nip19 } from 'nostr-tools';
import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import './App.css';
import { db, addTabToDB, deleteTabDB, updateTabDB, listTabs } from './db';
import { browser } from './browser';

import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import { BsArrowRightCircle, BsFillPersonFill } from "react-icons/bs";

import { EditKey } from './components/EditKey';
import { Input } from './components/Input';
import { Modal } from './components/ModalWindow';
import { IconBtn } from './components/iconBtn';
import coracleIcon from './icons/coracle.png';
import irisIcon from './icons/iris.png';
import nostrIcon from './icons/nb.png';
import satelliteIcon from './icons/satellite.png';
import snortIcon from './icons/snort.png';

const apps = [
  { title: 'Nostr', img: nostrIcon, link: 'https://nostr.band/' },
  { title: 'Snort', img: snortIcon, link: 'https://snort.social/' },
  { title: 'Iris', img: irisIcon, link: 'https://iris.to/' },
  { title: 'Coracle', img: coracleIcon, link: 'https://coracle.social/' },
  { title: 'Satellite', img: satelliteIcon, link: 'https://satellite.earth/' }
];

const getPromisePlugin = (method, msg = '') => {
  return new Promise((resolve, reject) => {
    cordova.plugins.NostrKeyStore[method](
      function (res) {
        resolve(res)
      },
      function (error) {
        reject(error)
      },
      msg ? msg : null
    )
  })
};

export const getNpubKey = (key) => {
  return nip19.npubEncode(key);
}

const API = {
  setUrl: async function (tab, url) {
    console.log("tab", tab.id, "setUrl", url);
    tab.url = url;
    await updateTabDB(tab);
  },
  decodeBech32: function (tab, s) {
    return nip19.decode(s);
  }
};

const App = () => {
  const [npub, setNpub] = useState('');
  const [modalActive, setModalActive] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [keys, setKeys] = useState();
  const [openKey, setOpenKey] = useState();
  const [list, setList] = useState();
  const [tabs, setTabs] = useState([]);
  const inputSearchRef = useRef();

  const openTabsFromDB = (list) => {
    if (list) {
      const orderedList = [...list].sort((prev, next) => next.order - prev.order);
      orderedList.forEach(async (tab) => { await openTab(tab, /* hidden */true); });
      setTabs([...orderedList]);
    }
  }

  useEffect(async () => {
    document.addEventListener("deviceready", onDeviceReady, false)

    async function onDeviceReady() {
      console.log('device ready');
      const list = await getPromisePlugin('listKeys');

      if (list.currentAlias) {
        const currentKey = getNpubKey(list.currentAlias);
        setNpub(currentKey);
        setList(list);
        const keys = Object.keys(list).filter((key) => key !== 'currentAlias');

        if (keys.length) {
          setKeys(keys)
        }
      }

      const currentAlias = list.currentAlias ? list.currentAlias : 'without publicKey';
      const tabsList = await listTabs(currentAlias);
      openTabsFromDB(tabsList);
    }
  }, [])

  const addKey = async () => {
    const key = await getPromisePlugin('addKey');

    if (key) {
      const list = await getPromisePlugin('listKeys');

      if (list.currentAlias) {
        const currentKey = getNpubKey(list.currentAlias);
        setList(list);

        if (currentKey !== npub) {
          setNpub(currentKey);
        }

        const keys = Object.keys(list).filter((key) => key !== 'currentAlias');

        if (keys.length) {
          setKeys(keys)
        }

        const tabsList = await listTabs(list.currentAlias);
        openTabsFromDB(tabsList);
      }
    }
  }

  const openTab = async (tab, hidden) => {
    const params = {
      url: tab.url,
      hidden,
      API,
      apiCtx: tab,
      onLoadStop: async function (event) {
	tab.url = event.url;
	await updateTabDB(tab);
      },
      onGetPubkey: async function (pubkey) {
        let npub = nip19.npubEncode(pubkey);
        console.log("npub", npub);
        setNpub(npub);
      },
      onClick: async function (x, y) {
	console.log("click", x, y);
	tab.ref.hide();
	document.elementFromPoint(x, y).click();
      },
      onMenu: async function () {
	console.log("menu click tab", tab.id);
	// FIXME just for now a hack to close a tab

	// close & remove tab
	await deleteTabDB(tab.id)
	tab.ref.close();
	setTabs((prev) => prev.filter(t => t.id != tab.id));
      },
    };

    // open the browser
    tab.ref = await browser.open(params);
  };

  const open = async (url, app, hidden) => {

    const tab = {
      id: "" + Math.random(),
      app,
      url,
      order: tabs.length + 1,
      ref: null, // filled below
    };

    await openTab(tab);

    setTabs((prev) => [tab, ...tabs]);

    await addTabToDB(tab, list);
  }

  const show = async (tab) => {
    tab.ref.show();
  }

  const editBtnClick = (ev) => {
    const index = ev.target.dataset.key;
    setOpenKey(keys[index])
    setModalActive(true)
  }

  async function copyKey() {
    const text = getNpubKey(list[openKey].publicKey);
    cordova.plugins.clipboard.copy(text);
  }

  const showKey = async () => {
    await getPromisePlugin('showKey', { publicKey: openKey });
  }

  const selectKey = async (ind) => {
    const key = keys[ind];
    const res = await getPromisePlugin('selectKey', { publicKey: key });

    if (res) {
      if (res.currentAlias && res.currentAlias !== list.currentAlias) {
        const currentKey = getNpubKey(res.currentAlias);
        setNpub(currentKey);
        setList(res);
        const keys = Object.keys(res).filter((key) => key !== 'currentAlias');

        if (keys.length) {
          setKeys(keys);
        }
      }

      const tabsList = await listTabs(res.currentAlias);
      openTabsFromDB(tabsList);
    }
  }

  const editKey = async (keyInfoObj) => {
    const keysList = await getPromisePlugin('editKey', keyInfoObj);

    if (keysList) {
      setList(keysList);
      const keys = Object.keys(keysList).filter((key) => key !== 'currentAlias');

      if (keys.length) {
        setKeys(keys)
      }
    }
  }

  const closeModal = () => {
    setIsOpenSearch(false);
    inputSearchRef.current.focus()
  }

  const handleClickSearchBtn = () => {
    const url = new URL('/', inputSearchRef.current.value);

    if (url) {
      const title = url.hostname;
      const link = inputSearchRef.current.value + '/';
      const img = inputSearchRef.current.value + '/' + '/favicon.ico';
      const app = { title, img, link };
      open(link, app);
      closeModal();
    }
  }

  const submitSearchInput = (ev) => {
    ev.preventDefault();
    handleClickSearchBtn();
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
      <header id="header" className="container d-flex align-items-center justify-content-between" style={{ padding: '0 10px 0 10px' }}>
        <BsFillPersonFill color='white' size={35} />
        <Dropdown data-bs-theme="dark"
          drop='down-centered'>
          <Dropdown.Toggle id="dropdown-basic"
          >
            {npub ? npub.substring(0, 10) + "..." + npub.substring(59) : 'Key is not chosen'}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {keys && keys.length && keys.map((key) => nip19.npubEncode(key)).map((key, ind) => {
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

        <AiOutlineSearch color='white' size={35} onClick={() => setIsOpenSearch(true)} />
      </header>
      <hr className='m-0' />
      <button onClick={() => db.delete()}>Delete DB</button>

      <div className="text-center p-3">
        {tabs && tabs.length > 0 &&
          <section className='d-flex flex-column align-items-start'>
            <h3>Tabs</h3>
            <div className='contentWrapper pb-2 d-flex gap-4'>
              {tabs.map((tab) => <IconBtn key={tab.app.title} data={tab.app} onClick={() => show(tab)} />)}
            </div>
          </section>
        }
        <section className='d-flex flex-column align-items-start'>
          <h3>Apps</h3>
          <div className='contentWrapper pb-2 d-flex gap-4'>
            {apps.map((app) => <IconBtn key={app.title} data={app} onClick={() => open(app.link, app)} />)}
          </div>
        </section>
      </div>
      <Modal activeModal={modalActive}>
        {modalActive &&
          <EditKey keyProp={list[openKey]}
            copyKey={copyKey}
            showKey={showKey}
            editKey={editKey}
            setModalActive={setModalActive} />}
      </Modal >
      <Modal activeModal={isOpenSearch}>
        {isOpenSearch &&
          (<div className='d-flex flex-column'>
            <div className='d-flex justify-content-end align-items-center p-3 mb-5 '>
              <AiOutlineClose color='white' size={30} onClick={closeModal} />
            </div>
            <form className='d-flex px-3 gap-3 align-items-center align-self-center ' onSubmit={submitSearchInput}>
              <Input ref={inputSearchRef} />
              <BsArrowRightCircle color='white' size={30} className='iconDropDown' onClick={handleClickSearchBtn} />
            </form>
          </div>)}
      </Modal >
    </>
  );
};

export default App;
