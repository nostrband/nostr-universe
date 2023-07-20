import { nip19 } from 'nostr-tools';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import './App.css';

import { AiOutlineSearch } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import { BsFillPersonFill } from "react-icons/bs";

import { EditKey } from './components/EditKey';
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
  return nip19.npubEncode(key).replace(/"/g, '');
}

const App = () => {
  const [npub, setNpub] = useState('');
  const [modalActive, setModalActive] = useState(false);
  const [keys, setKeys] = useState();
  const [openKey, setOpenKey] = useState();
  const [list, setList] = useState();
  const [tabs, setTabs] = useState([]);

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
      }
    }
  }

  const open = async (url, app) => {
    const header = document.getElementById('header');
    const offset = header.offsetHeight + header.offsetTop;
    const top = Math.round(window.devicePixelRatio * offset);
    const ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes,closebuttonhide=yes,multitab=yes,menubutton=yes,zoom=no,topoffset=' + top);

    const tab = {
      id: "" + Math.random(),
      ref,
      app,
      url
    };
    setTabs((prev) => [tab, ...tabs]);

    // init the web pages after loading
    ref.addEventListener('loadstop', async (event) => {

      console.log("loadstop", event.url);
      tab.url = event.url;

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

    // tab menu, for now just closes the tab
    ref.addEventListener('menu', async () => {
      console.log("menu click tab", tab.id);
      // FIXME just for now a hack to close a tab

      // close & remove tab
      ref.close();
      setTabs((prev) => prev.filter(t => t.id != tab.id));

      // send message to the ref tab to make it show our menu
    });

    // handle clicks outside the inappbrowser to
    // intercept them and forward to our main window
    ref.addEventListener('click', async (event) => {
      console.log("click", event.x, event.y);
      ref.hide();

      const x = event.x / window.devicePixelRatio;
      const y = event.y / window.devicePixelRatio;
      document.elementFromPoint(x, y).click();
    });

    // handle api requests
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
      if (list.currentAlias) {
        const currentKey = getNpubKey(res.currentAlias);
        setNpub(currentKey);
        setList(res);
        const keys = Object.keys(res).filter((key) => key !== 'currentAlias');

        if (keys.length) {
          setKeys(keys)
        }
      }
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
      <header id="header" className="container d-flex align-items-center justify-content-between" style={{ padding: '10px' }}>
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
      <div className="text-center p-3">
        {tabs.length > 0 && (
          <section className='d-flex flex-column align-items-start'>
            <h3>Tabs</h3>
            <div className='contentWrapper pb-2 d-flex gap-4'>
              {tabs.map((tab) => <IconBtn key={tab.app.title} data={tab.app} onClick={() => show(tab)} />)}
            </div>
          </section>
        )}
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
    </>
  );
};

export default App;
