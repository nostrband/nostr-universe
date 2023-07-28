import { nip19 } from 'nostr-tools';
import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
//import Modal from 'react-bootstrap/Modal';
import './App.css';
import { browser } from './browser';
import { config } from './config';
import { addTab, db, deleteTab, updateTab, listTabs, listPins, addPin, deletePin, getFlag, setFlag } from './db';
import { keystore } from './keystore';

import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import { BsArrowRightCircle, BsFillPersonFill } from "react-icons/bs";

import { EditKey } from './components/EditKey';
import { Input } from './components/Input';
import { Modal } from './components/ModalWindow';
import { Profile } from './components/Profile';
import { IconBtn } from './components/iconBtn';
import { PinApp } from './components/PinApp';

import coracleIcon from './icons/coracle.png';
import irisIcon from './icons/iris.png';
import nostrIcon from './icons/nb.png';
import satelliteIcon from './icons/satellite.png';
import snortIcon from './icons/snort.png';

const apps = [
  { naddr: "10", name: 'NostrApp', picture: "https://nostrapp.link/logo.png", url: 'https://nostrapp.link/', kinds: [0, 31990, 31989] },
  { naddr: "1", name: 'Nostr', picture: nostrIcon, url: 'https://nostr.band/', kinds: [0, 1, 3, 30000, 30001, 30023, 9735, 1985] },
  { naddr: "2", name: 'Snort', picture: snortIcon, url: 'https://snort.social/', kinds: [0, 1, 3, 4, 6, 7, 30000, 30001, 9735, 1984, 1985], handlers: {0: {url: "https://snort.social/p/<bech32>"}} },
  { naddr: "3", name: 'Iris', picture: irisIcon, url: 'https://iris.to/', kinds: [0, 1, 3, 4, 6, 7, 30000, 30001, 9735, 1984, 1985] },
  { naddr: "4", name: 'Coracle', picture: coracleIcon, url: 'https://coracle.social/', kinds: [0, 1, 3, 4, 6, 7, 30000, 30001, 9735, 1984, 1985] },
  { naddr: "5", name: 'Satellite', picture: satelliteIcon, url: 'https://satellite.earth/', kinds: [0, 1, 3, 4, 6, 7, 30000, 30001, 9735, 1984, 1985] },
  { naddr: "6", name: 'Zapddit', picture: "https://zapddit.com/assets/icons/logo-without-text-zapddit.svg", url: 'https://zapddit.com/', kinds: [0, 1, 3, 4, 6, 7, 30000, 30001, 9735, 1984, 1985] },
  { naddr: "7", name: 'Agora', picture: "https://agorasocial.app/images/favicon/120.png", url: 'https://agorasocial.app/', kinds: [0, 1, 3, 4, 6, 7, 30000, 30001, 9735, 1984, 1985] },
  { naddr: "8", name: 'Pinstr', picture: "https://pinstr.app/favicon.ico", url: 'https://pinstr.app/', kinds: [0, 1, 3, 4, 6, 7, 30000, 30001, 9735, 1984, 1985] },
  { naddr: "9", name: 'Nosta', picture: "https://nosta.me/images/apple-icon-120x120.png", url: 'https://nosta.me/', kinds: [0, 1, 3, 30000, 30001 ], handlers: {0: {url: "https://nosta.me/<bech32>"}} },
];

export const getNpub = (key) => {
  return nip19.npubEncode(key);
}

const API = {
  setUrl: async function (tab, url) {
    if (tab) {
      console.log("tab", tab.id, "setUrl", url);
      tab.url = url;
      await updateTab(tab);
    }
  },
  decodeBech32: function (tab, s) {
    return nip19.decode(s);
  }
};

const DEFAULT_PUBKEY = "anon";

const App = () => {
  //  const [npub, setNpub] = useState('');
  const [keys, setKeys] = useState();
  const [currentPubkey, setCurrentPubkey] = useState();
  
  const [pins, setPins] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [currentTab, setCurrentTab] = useState(null)
  const [lastTab, setLastTab] = useState(null)
  const [prevTab, setPrevTab] = useState(null)
  
  const [trendingProfiles, setTrendingProfiles] = useState();

  const inputSearchRef = useRef();

  const [nostrTabs, setNostrTabs] = useState([]);
  const [otherTabs, setOtherTabs] = useState([]);

  // FIXME move to a separate page
  const [modalActive, setModalActive] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [openKey, setOpenKey] = useState();

  const [pinModalActive, setPinModalActive] = useState(false);
  const [pinApp, setPinApp] = useState(null);
  
  const loadKeys = async () => {
    const list = await keystore.listKeys();

    if (list.currentAlias) {
      setCurrentPubkey(list.currentAlias);
      const keys = Object.keys(list).filter((key) => key !== 'currentAlias');
      if (keys.length) {
        setKeys(keys)
      }
    }

    return list.currentAlias;
  }

  const loadWorkspace = async (workspaceKey) => {
//    const dbTabs = await listTabs(workspaceKey);
    const dbPins = await listPins(workspaceKey);
    console.log("dbPins", JSON.stringify(dbPins));

//    setTabs(dbTabs);
    setPins(dbPins);
  }

  const bootstrap = async (pubkey) => {
    console.log("new workspace, bootstrapping");
    let pins = [];
    apps.forEach((app, ind) => {
      const pin = {
        id: "" + Math.random(),
        url: app.url,
	appNaddr: app.naddr,
	title: app.name,
	icon: app.picture,
        order: ind,
        pubkey: pubkey
      };
      pins.push(pin)
    });
    await db.pins.bulkAdd(pins);
  }

  const ensureBootstrapped = async (workspaceKey) => {
    if (!(await getFlag(workspaceKey, 'bootstrapped'))) {
      await bootstrap(workspaceKey);
      await setFlag(workspaceKey, 'bootstrapped', true);
    }
  }

  useEffect(() => {

    async function fetchTrendingProfiles() {
      const r = await fetch("https://api.nostr.band/v0/trending/profiles");
      const tpr = await r.json();
      const tp = tpr.profiles.map(p => {
        try {
          const pr = JSON.parse(p.profile.content);
          pr.npub = getNpub(p.pubkey);
	  pr.pubkey = p.pubkey;
          return pr;
        } catch (e) {
          console.log("failed to parse profile", e);
          return undefined;
        }
      });
      if (tp.length > 10)
        tp.length = 10;
      setTrendingProfiles(tp);
    }
    
    async function onDeviceReady() {
      console.log('device ready');

      const currentKey = await loadKeys();

      const workspaceKey = currentKey || DEFAULT_PUBKEY;
      await ensureBootstrapped(workspaceKey);
      await loadWorkspace(workspaceKey);
      await fetchTrendingProfiles();
    }

    if (config.DEBUG)
      onDeviceReady();
    else
      document.addEventListener("deviceready", onDeviceReady, false);
  }, [])

  const addKey = async () => {
    await keystore.addKey();

    // reload the list
    const pubkey = await loadKeys();

    // reassign everything from default to the new key
    if (currentPubkey == DEFAULT_PUBKEY) {
      await db.tabs.where({ pubkey: DEFAULT_PUBKEY }).modify({ pubkey });
      await db.pins.where({ pubkey: DEFAULT_PUBKEY }).modify({ pubkey });
    }

    // make sure this key has default apps pinned
    await ensureBootstrapped(pubkey);
    
    // load new key's tabs etc
    await loadWorkspace(pubkey);
  }

  const createTab = async (tab) => {
    const params = {
      url: tab.url,
      hidden: true,
      API,
      apiCtx: tab,
      onLoadStop: async (event) => {
        tab.url = event.url;
        await updateTab(tab);
      },
      onGetPubkey: (pubkey) => {
	if (pubkey != currentPubkey) {
          let npub = nip19.npubEncode(pubkey);
          console.log("npub", npub);
          setCurrentPubkey(pubkey);
	  // FIXME bootstrap etc, just remove it and start onboarding?
	}
      },
      onClick: (x, y) => {
        console.log("click", x, y);
//	tab.ref.hide();
//	hide(tab);
	document.elementFromPoint(x, y).click();
      },
      onMenu: async () => {
        console.log("menu click tab", tab.id);
//	browser.showMenu(tab.ref);
//	return;

        // FIXME just for now a hack to close a tab
        // close & remove tab
	close(tab);
      },
      onBlank: (url) => {
	hide(tab);
	open(url);
      },
    };

    // open the browser
    tab.ref = await browser.open(params);
  };

  const close = async (tab) => {
    hide (tab);

    await deleteTab(tab.id)
    tab.ref.close();

    setTabs((prev) => prev.filter(t => t.id != tab.id));
  }
  
  const hide = (tab) => {
    if (tab) {
      tab.ref.hide();
      setLastTab(currentTab);
      setCurrentTab(null);
    }

    document.getElementById('pins').classList.remove("d-none");
    document.getElementById('pins').classList.add("d-flex");
    document.getElementById('tab-menu').classList.remove("d-flex");
    document.getElementById('tab-menu').classList.add("d-none");
  }

  const showTabMenu = () => {
    document.getElementById('pins').classList.remove("d-flex");
    document.getElementById('pins').classList.add("d-none");
    document.getElementById('tab-menu').classList.remove("d-none");
    document.getElementById('tab-menu').classList.add("d-flex");
  }
  
  const show = async (tab) => {

    showTabMenu();
    
    return new Promise((ok) => {
      setTimeout(async () => {

	// schedule the open after task bar is changed
	if (!tab.ref)
	  await createTab(tab);
	
	tab.ref.show();
	if (lastTab && lastTab.id != tab.id)
	  setPrevTab(lastTab);
	setCurrentTab(tab);
	ok();
      }, 0);
    });
  }

  const toggle = (tab) => {
    console.log("toggle", tab.id, currentTab);
    if (currentTab != null && tab.id === currentTab.id) {
      hide(tab);
    } else {
      show(tab);
    }
  }
  const openApp = async (url, app) => {
    return open(url, {
      appNaddr: app.naddr,
      title: app.name,
      icon: app.picture,
    });
    
  }

  const open = async (url, pin) => {
    console.log("open", url);

    // make sure it's visible and has proper height
    showTabMenu();

    // check if an open tab for this app exists
    if (pin) {
      const tab = tabs.find(t => t?.appNaddr == pin.appNaddr);
      if (tab) {
	show(tab);
	return;
      }
    }
    
    // schedule the open when tab menu is rendered
    setTimeout(async () => {
      
      const U = new URL(url);
      const title = U.hostname;

      const tab = {
	id: "" + Math.random(),
	pubkey: currentPubkey,
	title: pin ? pin.title : title,
	icon: pin ? pin.icon : (U.origin + "/favicon.ico"),
	url,
	order: tabs.length + 1,
	ref: null, // filled below
	pinned: pin && pin.id,
      };
      if (pin)
	tab.appNaddr = pin.appNaddr;
      console.log("open", url, JSON.stringify(pin), JSON.stringify(tab));

      await createTab(tab);

      await addTab(tab);

      await show(tab);
      
      if (lastTab && lastTab.id != tab.id)
	setPrevTab(lastTab);
      setCurrentTab(tab);
      setTabs((prev) => [tab, ...tabs]);
    }, 0);
  }

  const editBtnClick = (ev) => {
    const index = ev.target.dataset.key;
    setOpenKey(keys[index])
    setModalActive(true)
  }

  async function copyKey() {
    const text = getNpub(openKey);
    cordova.plugins.clipboard.copy(text);
  }

  const showKey = async () => {
    await keystore.showKey({ publicKey: openKey });
  }

  const selectKey = async (ind) => {
    const key = keys[ind];
    const res = await keystore.selectKey({ publicKey: key });

    if (res && res.currentAlias !== currentPubkey) {
      const pubkey = await loadKeys();
      await loadWorkspace(pubkey);
    }
  }

  const editKey = async (keyInfoObj) => {
    const keysList = await keystore.editKey(keyInfoObj);

    if (keysList) {
      await loadWorkspace(currentPubkey);
    }
  }

  const closeModal = () => {
    setIsOpenSearch(false);
    inputSearchRef.current.focus()
  }

  const handleClickSearchBtn = () => {
    const url = new URL('/', inputSearchRef.current.value);

    if (url) {
      const url = inputSearchRef.current.value;
      open(url);
      closeModal();
    }
  }

  const submitSearchInput = (ev) => {
    ev.preventDefault();
    handleClickSearchBtn();
  }

  const onProfileClick = (pubkey) => {
    console.log("show", pubkey);

    const nprofile = nip19.nprofileEncode({pubkey, relays:["wss://relay.nostr.band"]});
    const pin = pins.find(p => p.perms && p.perms.find(k => k == 0) !== undefined);
    console.log("pin", JSON.stringify(pin));
    const app = apps.find(a => a.naddr == pin.appNaddr);
    console.log("app", JSON.stringify(app));
    const handler = app.handlers[0];
    const url = handler.url.replace("<bech32>", nprofile);
    
    console.log("profile app", app, pin, url);

    open(url, pin);
  }

  const closeTab = () => {
    console.log("closeTab");
    if (currentTab)
      close(currentTab);
  }

  const hideTab = () => {
    console.log("hideTab");
    if (currentTab)
      hide(currentTab);
  }

  const showTabs = () => {
  }

  const switchTabs = () => {
    hideTab();
    show(prevTab);
  }
  
  const togglePinTab = () => {
    if (!currentTab)
      return;

    if (currentTab.pinned) {
	// unpin
	const pin = pins.find(p => p.appNaddr == currentTab.appNaddr);
      if (pin) {
	setPins(prev => prev.filter(p => p.id != pin.id));
	deletePin(pin.id);

	currentTab.pinned = false;
      }
    } else {
      const app = apps.find(a => a.naddr == currentTab.appNaddr);
      console.log("pin app", app);
      setPinApp(app);
      setPinModalActive(true);
      currentTab.ref.hide();
    }
  }  

  const savePin = (app, perms) => {

    const pin = {
      id: "" + Math.random(),
      url: currentTab.url,
      appNaddr: currentTab.appNaddr,
      title: currentTab.title,
      icon: currentTab.icon,
      order: pins.length,
      pubkey: currentPubkey,
      perms,
    };

    console.log("perms", JSON.stringify(perms));

    setPins(prev => [...prev, pin]);
    addPin(pin);

    currentTab.pinned = true;

    currentTab.ref.show();
  }

  const hidePinModal = () => {
    setPinModalActive(false);
    currentTab.ref.show();
  }
  
  const npub = currentPubkey ? getNpub(currentPubkey) : "";
  return (
    <>
      <header id="header">
	<div className="container d-flex align-items-center justify-content-between">
	  <BsFillPersonFill color='white' size={35} />
	  <Dropdown data-bs-theme="dark"
	    drop='down-centered'>
	    <Dropdown.Toggle id="dropdown-basic" variant="secondary"
	    >
	      {npub ? npub.substring(0, 10) + "..." + npub.substring(59) : 'Key is not chosen'}
	    </Dropdown.Toggle>

	    <Dropdown.Menu>
	      {keys && keys.length && keys.map((key) => nip19.npubEncode(key)).map((key, ind) => {
		return (<Dropdown.Item key={key} href={`#/${key + 1}`} className='d-flex align-items-center gap-4'>
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
	</div>
	<hr className='m-0' />
      </header>
      <main>
	{false && <button onClick={() => db.delete()}>Delete DB</button>}
	{trendingProfiles && (
	  <div className='container-fluid p-1'>
            <h3>Trending profiles</h3>
            <div className='d-flex flex-row flex-nowrap overflow-auto'>
              {trendingProfiles.map(p => (
		<Profile key={p.npub} profile={p} onClick={onProfileClick} />
              ))}
            </div>
	  </div>
	)}

	{true && (
	  <div>
            <h3 className="ps-3">Apps</h3>
            <section className='container d-flex align-items-start'>
              <div className='contentWrapper d-flex gap-4'>
		{apps.map((app) => <IconBtn key={app.url} data={app} size='big' onClick={() => openApp(app.url, app)} />)}
              </div>
            </section>
	  </div>
	)}
	<Modal activeModal={modalActive}>
	  {modalActive &&
	   <EditKey keyProp={list[openKey]}
	     copyKey={copyKey}
	     showKey={showKey}
	     editKey={editKey}
	     setModalActive={setModalActive} />}
	</Modal>
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
	</Modal>
	<Modal activeModal={pinModalActive}>
	  {pinModalActive && 
	   <PinApp
	     app={pinApp}
	     close={hidePinModal}
	     savePin={savePin}
	   />
	  }
	</Modal>
      </main>
      <footer id='footer'>
	<hr className='m-0' />
	<div id='pins' className="container d-flex align-items-center gap-2 p-1">
	  {pins.map((p) => <IconBtn key={p.name} data={p} size='small' onClick={() => open(p.url, p)} />)}
	  {false && tabs.map((t) => <IconBtn key={t.id} data={t} size='small' onClick={() => toggle(t)} />)}
        </div>
	<div id='tab-menu' className="container d-none justify-content-end gap-1">
	  <div><Button variant="secondary" size="small" onClick={closeTab}>Close</Button></div>
	  {currentTab && currentTab.appNaddr && 
	   <div><Button variant="secondary" size="small"
		  onClick={togglePinTab}>{currentTab && currentTab.pinned ? "Unpin" : "Pin"}</Button></div>
	  }
	  {false && <div><Button variant="secondary" size="small" onClick={showTabs}>Tabs</Button></div>}
	  {false && prevTab && <div><Button variant="secondary" size="small" onClick={switchTabs}>Switch</Button></div>}
	  <div><Button variant="secondary" size="small" onClick={hideTab}>Hide</Button></div>
	</div>
      </footer>
    </>
  );
};

export default App;
