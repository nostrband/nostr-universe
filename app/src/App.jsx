import { nip19 } from 'nostr-tools';
import { useEffect, useRef, useState } from 'react';
import './App.css';

import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdOutlineDone } from "react-icons/md";

import { Modal } from './components/ModalWindow';
import { IconBtn } from './components/iconBtn';
import avatar from './icons/avatar.png';
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
  const [isOpenKeysList, setIsOpenKeysList] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [keys, setKeys] = useState();
  const [openKey, setOpenKey] = useState();
  const [list, setList] = useState();
  const [tabs, setTabs] = useState([]);
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
      } else {
        setNpub('Key is not chosen')
      }
      // }
      console.log(JSON.stringify(list))
    }
  }, [])
  const openListKeys = async () => {
    setIsOpenKeysList((prev) => !prev)
  }

  const addKey = async () => {
    const key = await promiseAddKey();
    if (key) {
      const list = await getListKeys();
      if (list.currentAlias) {
        const currentKey = nip19.npubEncode(list.currentAlias).replace(/"/g, '');
        setList(list);
        if (currentKey !== npub) {
          setNpub(currentKey);
        }
        const keys = Object.keys(list).filter((key) => key !== 'currentAlias');
        if (keys.length) {
          // const infoKeys = keys.map((key) => nip19.npubEncode(key).replace(/"/g, ''))
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
          resolve(res)
        },
        function (error) {
          reject(error)
        }
      )
    })
  }

  const open = async (url, app) => {
    const ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes,closebuttonhide=yes,multitab=yes,menubutton=yes');

    const tab = {
      ref,
      app,
      url
    };
    setTabs((prev) => [tab, ...tabs]);

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

    ref.addEventListener('menu', async () => {
      console.log("menu click");
      // send message to the ref tab to make it show our menu
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

  const show = async (tab) => {
    tab.ref.show();
  }

  const editBtnClick = (ev) => {
    const index = ev.target.dataset.key;
    setOpenKey(keys[index])
    setModalActive(true)
  }

  async function copyKey() {
    const text = list[openKey].publicKey

    await cordova.plugins.clipboard.copy(text, (val) => {
      console.log('I success', val)
    }, () => {
      console.log('I err')
    });
  }

  const showKey = async () => {
    const key = await promiseShowKey({ publicKey: openKey })
    console.log(JSON.stringify(key))
  }

  function promiseShowKey(msg) {
    return new Promise((resolve, reject) => {
      cordova.plugins.NostrKeyStore.showKey(
        function (res) {
          console.log(JSON.stringify(res), 'I work')
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
    console.log('value', ref.current.value)
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
          console.log(JSON.stringify(res), 'I work')
          resolve(res)
        },
        function (error) {
          reject(error)
        },
        msg
      )
    })
  }

  const submit = (ev) => {
    ev.preventDefault();
    console.log(ev.target.search.value)
  }

  return (
    <>
      <header className="header">
        <img src={avatar} alt='avatar image' className='iconImg' />
        <div className='keyInfo'>
          <div className='key'>{npub}</div>
          <button className='dropDown' onClick={openListKeys}>
            <IoMdArrowDropdown color='white' size={24} className='iconDropDown' />
          </button>
        </div>
        <div className={isOpenKeysList ? 'keysList isOpen' : 'keysList'}>
          <ul className='list'>
            {keys && keys.length && keys.map((key) => nip19.npubEncode(key).replace(/"/g, '')).map((key, ind) => {
              return (<li className='listItem itemKey' key={key}>
                <img src={avatar} alt='avatar image' className='iconImg' />
                <div className='key'>{key}</div>
                <button className='editBtn' data-key={ind} onClick={(ev) => editBtnClick(ev)}>
                  <BiSolidPencil color='white' size={20} className='iconDropDown' />
                </button>
              </li>)
            }
            )
            }

            <li className='listItem btn'>
              <button className='addBtn' onClick={addKey}>
                + Add keys
              </button>
            </li>
          </ul>
        </div>
      </header>
      <div className="wrapper">
        <form className='form' onSubmit={(ev) => submit(ev)}>
          <input className='input' name='search' type="search" placeholder="Search..." />
          <button className="button" type='submit'><AiOutlineSearch color='gray' size={20} className='iconDropDown' /></button>
        </form>
        {tabs.length > 0 && (
	  <section className='section'>
            <h3>Tabs</h3>
            <div className='contentWrapper'>
              {tabs.map((tab) => <IconBtn key={tab.app.title} data={tab.app} onClick={() => show(tab)} />)}
            </div>
          </section>
	)}
        <section className='section'>
          <h3>Apps</h3>
          <div className='contentWrapper'>
            {apps.map((app) => <IconBtn key={app.title} data={app} onClick={() => open(app.link, app)} />)}
          </div>
        </section>
      </div>
      <Modal activeModal={modalActive} setActive={setModalActive}>
        {modalActive && (<div>
          <div className='modalTitle'>
            <h2>Edit key</h2>
            <button className='dropDown' onClick={() => setModalActive(false)}>
              <AiOutlineClose color='white' size={24} className='iconDropDown' />
            </button>
          </div>
          <div className='modalKey'>
            {nip19.npubEncode(list[openKey].publicKey).replace(/"/g, '')}
          </div>
          <div className='modalBtnWrapper'>
            <button className='addBtn' onClick={copyKey}>Copy</button>
            <button className='addBtn' onClick={showKey}>Show secret</button>
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
