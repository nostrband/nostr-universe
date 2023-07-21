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

  const API = {
    setUrl: function (tab, url) {
      console.log("tab", tab.id, "setUrl", url);
      tab.url = url;
      // FIXME write to db
    },
    decodeBech32: function (tab, s) {
      return nip19.decode(s);
    }
  };

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

  const initTab = () => {
    // this code will be executed in the opened tab,
    // should only refer to local vars bcs it will be
    // sent to the tab as a string

    const initWindowNostr = () => {
      window.nostrCordovaPlugin = { requests: {} };
      const _call = function (method, ...params) {
	const id = Date.now().toString();
	window.nostrCordovaPlugin.requests[id] = {};
	return new Promise(function (ok, err) {
          window.nostrCordovaPlugin.requests[id] = { res: ok, rej: err };
	  const msg = JSON.stringify({ method, id, params: [...params] });
	  console.log("iab sending req ", id, "method", method, "msg", msg);
          webkit.messageHandlers.cordova_iab.postMessage(msg);
	});
      };
      const _gen = function (method) {
	return function(...a) { return _call(method, ...a); };
      }
      const nostrKey = {
	getPublicKey: _gen("getPublicKey"),
	signEvent: _gen("signEvent"),
	nip04: {
          encrypt: _gen("encrypt"),
          decrypt: _gen("decrypt"),
	}
      };

      // NIP-07 API
      window.nostr = nostrKey;

      // our own API
      window.nostrCordovaPlugin.setUrl = _gen("setUrl");
      window.nostrCordovaPlugin.decodeBech32 = _gen("decodeBech32");
    };

    const initUrlChange = () => {

      // popstate event doesn't work for history.pushState which most SPAs use
      const body = document.querySelector("body");
      let oldHref = document.location.href;
      const observer = new MutationObserver(mutations => {
	if (oldHref !== document.location.href) {
	  oldHref = document.location.href;
	  console.log("url change", document.location.href);
	  window.nostrCordovaPlugin.setUrl(document.location.href);
	}
      });
      observer.observe(body, { childList: true, subtree: true });
    };

    initWindowNostr();
    initUrlChange();
  }

  // executed in the tab
  const nostrZapConnect = () => {

    let onlongtouch = null;
    let timer = null;
    let touchduration = 800; // length of time we want the user to touch before we do something

    const touchstart = (e) => {
      // Error: unable to preventdefault inside passive event listener due to target being treated as passive
      // e.preventDefault();
      if (!timer) {
        timer = setTimeout(() => onlongtouch(e), touchduration);
      }
    }

    const touchend = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }

    const zap = async (value) => {
      // limit prefixes to small ascii chars
      const BECH32_REGEX =
	/[a-z]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/g

      const array = [...value.matchAll(BECH32_REGEX)].map(a => a[0]);

      let bech32 = "";
      for (let b32 of array) {
	try {
	  const {type, data} = await window.nostrCordovaPlugin.decodeBech32(b32);
	  console.log("b32", b32, "type", type, "data", data);
	  switch (type) {
	    case "npub":
	      bech32 = b32;
	      break;
	  }
	} catch (e) {
	  console.log("bad b32", b32, "e", e);
	}

	if (bech32)
	  break;
      }

      if (!bech32)
	return false;

      console.log("zapping", bech32);
      const d = document.createElement("div");
      d.setAttribute("data-npub", bech32);
      window.nostrZap.initTarget(d);
      d.click();
      d.remove();

      return true;
    }

    const zapByAttr = async (e, attrName) => {
      const value = e.target.getAttribute(attrName);
      console.log("attr", attrName, "value", value);
      if (!value)
	return false;

      return zap(value);
    }

    onlongtouch = async (e) => {
      timer = null;
      console.log("longtouch", e.target);
      try {
	return await zapByAttr(e, "href")
	    || await zapByAttr(e, "id")
	    || await zapByAttr(e, "data-npub")
	    || await zapByAttr(e, "data-id")
	    || await zapByAttr(e, "data-note-id")
	    || await zap(document.location.href)
	;
      } catch (e) {
	console.log("zap failed", e);
      }
    };

    // assume content is already loaded
    window.addEventListener("touchstart", touchstart, false);
    window.addEventListener("touchend", touchend, false);
    window.addEventListener("mousedown", touchstart, false);
    window.addEventListener("mouseup", touchend, false);
  };

  // get local file by path as string, async
  const getAsset = async (path) => {
    return new Promise((ok, err) => {
      const r = new XMLHttpRequest();
      r.open("GET", path, true);
      r.onload = (e) => {
	if (r.readyState === 4) {
	  if (r.status === 200) {
	    console.log("got asset ", path);
	    ok(r.responseText);
	  } else {
	    err("failed to get asset "+path+" r "+r.statusText);
	  }
	}
      };
      r.onerror = (e) => {
	err("failed to get asset "+path+" r "+r.statusText);
      };
      r.send(null);
    });
  };

  // must not be () => {} form bcs it wont be able to access 'this'
  async function executeScriptAsync(code, name) {
    const self = this;
    return new Promise((ok, err) => {
      try {
	self.executeScript({code}, (v) => {
	  console.log("injected script", name);
	  ok(v);
	});
      } catch (e) {
	console.log("failed to inject script", name);
	err(e);
      }
    });
  }

  async function executeFuncAsync(name, fn, ...args) {
    const code = `(${fn.toString()})(...${JSON.stringify(args)})`;
    console.log("fn", name, "code", code);
    return this.executeScriptAsync(code, name);
  }

  const open = async (url, app) => {
    const header = document.getElementById('header');
    const offset = header.offsetHeight + header.offsetTop;
    const top = Math.round(window.devicePixelRatio * offset);
    // FIXME what shall we do if npub not set?
    const db = npub ? "db_" + npub.substring(0, 15) : "";
    const options = `location=yes,fullscreen=no,closebuttonhide=yes,multitab=yes,menubutton=yes,zoom=no,topoffset=${top},database=${db}`;
    console.log("options", options);
    const ref = cordova.InAppBrowser.open(url, '_blank', options);
    ref.executeScriptAsync = executeScriptAsync;
    ref.executeFuncAsync = executeFuncAsync;

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

      // main init to enable comms interface
      await ref.executeFuncAsync("initTab", initTab);

      // nostr-zap
      const asset = await getAsset("js/nostr-zap.js");
      console.log("nostr-zap asset", asset.length);
      await ref.executeScriptAsync(asset, "nostr-zap");

      // init nostr-zap
      await ref.executeFuncAsync("nostrZapConnect", nostrZapConnect);
    });

    // handle api requests
    ref.addEventListener('message', async (params) => {
      // console.log("got iab message", JSON.stringify(params));
      const id = params.data.id.toString();
      const method = params.data.method;
      let target = null;
      let targetArgs = params.data.params;
      switch (method) {
	case "encrypt":
	case "decrypt":
	  target = window.nostr.nip04;
	  break;
	case "getPublicKey":
	case "signEvent":
	  target = window.nostr;
	  break;
	case "setUrl":
	case "decodeBech32":
	  target = API;
	  targetArgs = [tab, ...targetArgs];
	  break;
      }

      let err = null;
      let reply = null;
      if (target) {
	try {
	  reply = await target[method](...targetArgs);
	} catch (e) {
	  err = `${e}`;
	}

	// FIXME remove later when we switch to onboarding
	if (method === 'getPublicKey') {
	  // in case we initialized it while the first getPublicKey call???
          let npub = nip19.npubEncode(reply);
	  console.log("npub", npub);
          setNpub(npub);
	}
      } else {
	err = `Unknown method ${method}`;
      }

      function fn(id, method, jsonReply, err) {
	const req = window.nostrCordovaPlugin.requests[id];
	if (!err) {
          req.res(jsonReply);
	} else {
          req.rej(new Error(err));
	};
	delete window.nostrCordovaPlugin.requests[id];
      };

      const args = [id, method, reply, err];
      await ref.executeFuncAsync("method " + method, fn, ...args);
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
