


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
        console.log("iab sending req ", id, "method", method, "msg", msg);
        webkit.messageHandlers.cordova_iab.postMessage(msg);
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
        const { type, data } = await window.nostrCordovaPlugin.decodeBech32(b32);
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
export async function open(params) {

  const header = document.getElementById('header');
  const offset = header.offsetHeight + header.offsetTop;
  const top = Math.round(window.devicePixelRatio * offset);

  // database option is a noop now, so leave it for later
  // const db = npub ? "db_" + npub.substring(0, 15) : "";
  // const options = `location=yes,fullscreen=no,closebuttonhide=yes,multitab=yes,menubutton=yes,zoom=no,topoffset=${top},database=${db}`;

  const options = `location=yes,fullscreen=no,closebuttonhide=yes,multitab=yes,menubutton=yes,zoom=no,topoffset=${top},hidden=${params.hidden ? "yes" : "no"}, bottomoffset=100px`;
  console.log("browser options", options);

  const ref = cordova.InAppBrowser.open(params.url, '_blank', options);
  ref.executeScriptAsync = executeScriptAsync;
  ref.executeFuncAsync = executeFuncAsync;

  ref.addEventListener('loadstop', async (event) => {
    if (params.onLoadStop)
      await params.onLoadStop(event); // updateTabDB

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
      case "setUrl":
      case "decodeBech32":
        target = params.API;
        targetArgs = [params.apiCtx, ...targetArgs];
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

  // handle clicks outside the inappbrowser to
  // intercept them and forward to our main window
  ref.addEventListener('click', async (event) => {
    console.log("browser click", event.x, event.y);
    const x = event.x / window.devicePixelRatio;
    const y = event.y / window.devicePixelRatio;
    if (params.onClick)
      await params.onClick(x, y);
  });

  // return to caller
  return ref;
}

export const browser = {
  open
}
