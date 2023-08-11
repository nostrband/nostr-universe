
const initTab = () => {
  // this code will be executed in the opened tab,
  // should only refer to local vars bcs it will be
  // sent to the tab as a string, thus functions
  // are declared inline below

  const initWindowNostr = () => {
    window.nostrCordovaPlugin = { requests: {} };
    const _call = function (method, ...params) {
      const id = Date.now().toString();
      window.nostrCordovaPlugin.requests[id] = {};
      return new Promise(function (ok, err) {
        window.nostrCordovaPlugin.requests[id] = { res: ok, rej: err };
        const msg = JSON.stringify({ method, id, params: [...params] });
        console.log("iab sending req ", id, "method", method, "msg", msg, "webkit", window.webkit);
        window.webkit.messageHandlers.cordova_iab.postMessage(msg);
      });
    };
    const _gen = function (method) {
      return function (...a) { return _call(method, ...a); };
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
    //    for (const name of apiMethods)
    //      window.nostrCordovaPlugin[name] = _gen(name);
    window.nostrCordovaPlugin.setUrl = _gen("setUrl");
    window.nostrCordovaPlugin.showContextMenu = _gen("showContextMenu");
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
const nostrMenuConnect = () => {

  let onlongtouch = null;
  let timer = null;
  let touchduration = 1300; // length of time we want the user to touch before we do something
  let touchX = 0;
  let touchY = 0;
  let curX = 0;
  let curY = 0;

  const isLongTouch = () => {
    return Math.abs (curX - touchX) < 20
	&& Math.abs (curY - touchY) < 20;
  }

  const touchStart = (e) => {
    // Error: unable to preventdefault inside passive event listener due to target being treated as passive
    //  e.preventDefault();

    const touch = e.touches?.item(0) || e;
    if (!timer) {
      touchX = touch.screenX;
      touchY = touch.screenY;

      timer = setTimeout(() => {
	timer = null;
	if (isLongTouch())
	  onLongTouch(e);
      }, touchduration);
    }
  }

  const touchMove = (e) => {
    const touch = e.touches?.item(0) || e;
    curX = touch.screenX;
    curY = touch.screenY;
    if (timer && !isLongTouch())
      touchEnd();
  }

  const touchEnd = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  const menu = async (value) => {
    // limit prefixes to small ascii chars
    const BECH32_REGEX =
      /[a-z]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/g

    const array = [...value.matchAll(BECH32_REGEX)].map(a => a[0]);

    let bech32 = "";
    for (let b32 of array) {
      try {
        const { type, data } = await window.nostrCordovaPlugin.decodeBech32(b32);
        console.log("b32", b32, "type", type, "data", data);
        switch (type) {
          case "npub":
          case "nprofile":
          case "note":
          case "nevent":
          case "naddr":
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

    console.log("menu for event", bech32);

    window.nostrCordovaPlugin.showContextMenu(bech32);

//    const d = document.createElement("div");
//    d.setAttribute("data-npub", bech32);
//    window.nostrZap.initTarget(d);
//    d.click();
//    d.remove();

    return true;
  }

  const menuByAttr = async (e, attrName) => {
    const value = e.getAttribute(attrName);
    console.log("attr", attrName, "value", value);
    if (!value)
      return false;

    return menu(value);
  }

  onLongTouch = async (e) => {
    const t = e.target;
    console.log("longtouch", t);
    try {
      return await menuByAttr(t, "href")
          || await menuByAttr(t, "id")
          || await menuByAttr(t, "data-npub")
          || await menuByAttr(t, "data-id")
          || await menuByAttr(t, "data-note-id")
      ;
    } catch (e) {
      console.log("menu failed", t);
    }
  };

  // assume content is already loaded
  window.addEventListener("touchstart", touchStart, false);
  window.addEventListener("touchmove", touchMove, false);
  window.addEventListener("touchend", touchEnd, false);
  window.addEventListener("mousedown", touchStart, false);
  window.addEventListener("mousemove", touchMove, false);
  window.addEventListener("mouseup", touchEnd, false);
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
          err("failed to get asset " + path + " r " + r.statusText);
        }
      }
    };
    r.onerror = (e) => {
      err("failed to get asset " + path + " r " + r.statusText);
    };
    r.send(null);
  });
};

// must not be () => {} form bcs it wont be able to access 'this'
async function executeScriptAsync(code, name) {
  const self = this;
  return new Promise((ok, err) => {
    try {
      self.executeScript({ code }, (v) => {
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

// returns ref to the browser window
export function open(params) {

  const header = document.getElementById('header');
  const topOffset = header.offsetHeight + header.offsetTop;
  const top = Math.round(window.devicePixelRatio * (topOffset + (params.top || 0)));
  const footer = document.getElementById('tab-menu');
  const bottomOffset = footer.offsetHeight - 1;
  const bottom = Math.round(window.devicePixelRatio * (bottomOffset + (params.bottom || 0)));
  const loc = "no"; // params.menu ? "no" : "yes";
  const menu = params.menu ? "no" : "yes";
  const hidden = params.hidden ? "yes" : "no";
  const geticon = params.geticon ? "yes" : "no";

  const options = `location=${loc},beforeload=yes,beforeblank=yes,fullscreen=no,closebuttonhide=yes,multitab=yes,menubutton=${menu},zoom=no,topoffset=${top},bottomoffset=${bottom},hidden=${hidden},geticon=${geticon}`;
  console.log("browser options", options);

  const ref = cordova.InAppBrowser.open(params.url, '_blank', options);
  ref.executeScriptAsync = executeScriptAsync;
  ref.executeFuncAsync = executeFuncAsync;

  ref.addEventListener('loadstart', async (event) => {
    if (params.onLoadStart)
      await params.onLoadStart(event);
  });

  ref.addEventListener('loadstop', async (event) => {

    // inject our scripts

    // main init to enable comms interface
    await ref.executeFuncAsync("initTab", initTab, params.API ? Object.keys(params.API) : []);

    if (!params.menu) {
      // nostr-zap
      //const asset = await getAsset("js/nostr-zap.js");
      //console.log("nostr-zap asset", asset.length);
      // await ref.executeScriptAsync(asset, "nostr-zap");

      // init context menu
      await ref.executeFuncAsync("nostrMenuConnect", nostrMenuConnect);
    }

    // after everything is done!
    if (params.onLoadStop)
      await params.onLoadStop(event);
  });

  // handle api requests
  ref.addEventListener('message', async (msg) => {
    // console.log("got iab message", JSON.stringify(msg));
    const id = msg.data.id.toString();
    const method = msg.data.method;
    let target = null;
    let targetArgs = msg.data.params;
    switch (method) {
      case "encrypt":
      case "decrypt":
        target = window.nostr.nip04;
        break;
      case "getPublicKey":
      case "signEvent":
        target = window.nostr;
        break;
      default:
	if (method in params.API) {
          target = params.API;
          targetArgs = [params.apiCtx, ...targetArgs];
	}
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
      if (method === 'getPublicKey' && params.onGetPubkey) {
        await params.onGetPubkey(reply);
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
    if (params.onMenu)
      await params.onMenu();
  });

  // tab is hidden
  ref.addEventListener('hide', async () => {
    if (params.onHide)
      await params.onHide();
  });

  // handle clicks outside the inappbrowser to
  // intercept them and forward to our main window
  ref.addEventListener('click', async (event) => {
    const x = event.x / window.devicePixelRatio;
    const y = event.y / window.devicePixelRatio;
    console.log("browser click", event.x, event.y, " => ", x, y);
    if (params.onClick)
      await params.onClick(x, y);
  });

  ref.addEventListener('blank', async (event) => {
    console.log("blank", event.url);
    if (params.onBlank)
      await params.onBlank(event.url);
  });

  ref.addEventListener('beforeload', async (event, cb) => {
    console.log("beforeload", JSON.stringify(event));
    if (event.url.startsWith("lightning:"))
      cordova.InAppBrowser.open(event.url, '_self');
    else if (params.onBeforeLoad)
      await params.onBeforeLoad(event.url);
  });

  // return to caller
  return ref;
}

const generateMenu = () => {
  document.body.innerHTML = "<div style='border: 1px solid #000; width: 100%, height: 100%; background-color: white;'><button onclick='javascript:parent.nostrCordovaPlugin.setUrl(\"test1\")'>test</button><br><button onclick='javascript:parent.nostrCordovaPlugin.setUrl(\"test2\")'>test2</button></div>";
};

const createMenu = (code) => {
  console.log("createMenu code ", code);
  let iframe = document.createElement("iframe");
  const html = `<body><script>${code}</script></body>`;
  iframe.style.position = "absolute";
  iframe.style.top = "50px";
  iframe.style.right = "50px";
  iframe.style.width = "300px";
  iframe.style.height = "500px";
  document.body.appendChild(iframe);
  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(html);
  iframe.contentWindow.document.close();

  function onClick() {
    if (iframe) {
      console.log("close iframe");
      iframe.remove();
      window.removeEventListener('click', onClick);
    }
  }

  window.addEventListener('click', onClick);
  iframe.addEventListener('click', (e) => {
    e.stopPropagation();
  });
};

export async function showMenu(ref) {
  const args = [];
  const code = `(${generateMenu.toString()})(...${JSON.stringify(args)})`;
  await ref.executeFuncAsync("menu", createMenu, code);  
}

export const browser = {
  open,
  showMenu
}
