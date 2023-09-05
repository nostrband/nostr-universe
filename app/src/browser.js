let API = {};

const setAPI = (a) => (API = a);

const refs = {};

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
        console.log(
          "iab sending req ",
          id,
          "method",
          method,
          "msg",
          msg,
          "webkit",
          window.webkit
        );
        window.webkit.messageHandlers.cordova_iab.postMessage(msg);
      });
    };
    const _gen = function (method) {
      return function (...a) {
        return _call(method, ...a);
      };
    };

    const nostrKey = {
      getPublicKey: _gen("getPublicKey"),
      signEvent: _gen("signEvent"),
      nip04: {
        encrypt: _gen("encrypt"),
        decrypt: _gen("decrypt"),
      },
    };
    
    // NIP-07 API
    window.nostr = nostrKey;

    const weblnKey = {
      sendPayment: _gen("sendPayment"),
      getInfo: _gen("getWalletInfo"),
      enable: () => {},
    };

    // for NIP-47 NWC 
    window.webln = weblnKey;
    
    if (!window.navigator)
      window.navigator = {};

    if (!navigator.clipboard)
      navigator.clipboard = {};

    // override with out own implementation
    navigator.clipboard.writeText = async (text) => {
      return await window.nostrCordovaPlugin.clipboardWriteText(text);
    };

    navigator.canShare = () => true;
    navigator.share = async (data) => {
      return await window.nostrCordovaPlugin.share(data);
    };
    
    window.nostrCordovaPlugin.setUrl = _gen("setUrl");
    window.nostrCordovaPlugin.showContextMenu = _gen("showContextMenu");
    window.nostrCordovaPlugin.decodeBech32 = _gen("decodeBech32");
    window.nostrCordovaPlugin.clipboardWriteText = _gen("clipboardWriteText");
    window.nostrCordovaPlugin.share = _gen("share");

    // for some clients that expect this
    setTimeout(() => {
      document.dispatchEvent(new Event('webln:ready'));
    }, 0);
  };

  const initUrlChange = () => {
    // popstate event doesn't work for history.pushState which most SPAs use
    const body = document.querySelector("body");
    let oldHref = document.location.href;
    const observer = new MutationObserver((mutations) => {
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
};

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
    return Math.abs(curX - touchX) < 20 && Math.abs(curY - touchY) < 20;
  };

  const touchStart = (e) => {
    // Error: unable to preventdefault inside passive event listener due to target being treated as passive
    //  e.preventDefault();

    const touch = e.touches?.item(0) || e;
    if (!timer) {
      touchX = touch.screenX;
      touchY = touch.screenY;

      timer = setTimeout(() => {
        timer = null;
        if (isLongTouch()) onLongTouch(e);
      }, touchduration);
    }
  };

  const touchMove = (e) => {
    const touch = e.touches?.item(0) || e;
    curX = touch.screenX;
    curY = touch.screenY;
    if (timer && !isLongTouch()) touchEnd();
  };

  const touchEnd = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const menu = async (value) => {
    // limit prefixes to small ascii chars
    const BECH32_REGEX = /[a-z]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/g;

    const array = [...value.matchAll(BECH32_REGEX)].map((a) => a[0]);

    let bech32 = "";
    for (let b32 of array) {
      try {
        const { type, data } = await window.nostrCordovaPlugin.decodeBech32(
          b32
        );
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

      if (bech32) break;
    }

    if (!bech32) return false;

    console.log("menu for event", bech32);

    window.nostrCordovaPlugin.showContextMenu(bech32);

    //    const d = document.createElement("div");
    //    d.setAttribute("data-npub", bech32);
    //    window.nostrZap.initTarget(d);
    //    d.click();
    //    d.remove();

    return true;
  };

  const menuByAttr = async (e, attrName) => {
    const value = e.getAttribute(attrName);
    console.log("attr", attrName, "value", value);
    if (!value) return false;

    return menu(value);
  };

  onLongTouch = async (e) => {
    const t = e.target;
    console.log("longtouch", t);
    try {
      const sel = window.getSelection().toString();
      if (sel) return await menu(sel);

      return (
        (await menuByAttr(t, "href")) ||
        (await menuByAttr(t, "id")) ||
        (await menuByAttr(t, "data-npub")) ||
        (await menuByAttr(t, "data-id")) ||
        (await menuByAttr(t, "data-note-id"))
      );
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
  if (params.id in refs) {
    console.log("browser ", id, "already opened");
    return;
  }

  const header = document.getElementById("header");
  const main = document.getElementById("main");
  const topOffset = main.offsetTop;
  const top = Math.round(
    window.devicePixelRatio * (topOffset + (params.top || 0))
  );
  const footer = document.getElementById("tab-menu");
  const bottomOffset = footer.offsetHeight - 1;
  const bottom = Math.round(
    window.devicePixelRatio * (bottomOffset + (params.bottom || 0))
  );
  const loc = "no"; // params.menu ? "no" : "yes";
  const menu = params.menu ? "no" : "yes";
  const hidden = params.hidden ? "yes" : "no";
  const geticon = params.geticon ? "yes" : "no";

  const options = `location=${loc},beforeload=yes,beforeblank=yes,fullscreen=no,closebuttonhide=yes,multitab=yes,menubutton=${menu},zoom=no,topoffset=${top},bottomoffset=${bottom},hidden=${hidden},geticon=${geticon},transparentloading=yes`;
  console.log("browser options", options);

  const ref = cordova.InAppBrowser.open(params.url, "_blank", options);
  ref.executeScriptAsync = executeScriptAsync;
  ref.executeFuncAsync = executeFuncAsync;

  let state = "";

  ref.addEventListener("loadstart", async (event) => {
    if (state === "starting") return;

    state = "starting";
    if (API.onLoadStart) await API.onLoadStart(params.apiCtx, event);
  });

  ref.addEventListener("loadstop", async (event) => {
    if (state === "init") return;

    state = "init";

    // inject our scripts

    // main init to enable comms interface
    await ref.executeFuncAsync("initTab", initTab);

    if (!params.menu) {
      // nostr-zap
      //const asset = await getAsset("js/nostr-zap.js");
      //console.log("nostr-zap asset", asset.length);
      // await ref.executeScriptAsync(asset, "nostr-zap");

      // init context menu
      await ref.executeFuncAsync("nostrMenuConnect", nostrMenuConnect);
    }

    // after everything is done!
    if (API.onLoadStop) await API.onLoadStop(params.apiCtx, event);
  });

  // handle api requests
  ref.addEventListener("message", async (msg) => {
    // console.log("got iab message", JSON.stringify(msg));
    const id = msg.data.id.toString();
    const method = msg.data.method;
    let target = null;
    let targetArgs = msg.data.params;
    if (method in API) target = API;
    if (params.apiCtx !== undefined)
      targetArgs = [params.apiCtx, ...targetArgs];

    let err = null;
    let reply = null;
    if (target) {
      try {
        reply = await target[method](...targetArgs);
      } catch (e) {
        err = `${e}`;
      }

      // FIXME remove later when we switch to onboarding
      if (method === "getPublicKey" && API.onGetPubkey) {
        await API.onGetPubkey(params.apiCtx, reply);
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
      }
      delete window.nostrCordovaPlugin.requests[id];
    }

    const args = [id, method, reply, err];
    await ref.executeFuncAsync("method " + method, fn, ...args);
  });

  // tab menu, for now just closes the tab
  ref.addEventListener("menu", async () => {
    if (API.onMenu) await API.onMenu(params.apiCtx);
  });

  // tab is hidden
  ref.addEventListener("hide", async () => {
    if (API.onHide) await API.onHide(params.apiCtx);
  });

  // handle clicks outside the inappbrowser to
  // intercept them and forward to our main window
  ref.addEventListener("click", async (event) => {
    const x = event.x / window.devicePixelRatio;
    const y = event.y / window.devicePixelRatio;
    console.log("browser click", event.x, event.y, " => ", x, y);
    if (API.onClick) await API.onClick(params.apiCtx, x, y);
  });

  ref.addEventListener("blank", async (event) => {
    if (event.url.startsWith("lightning:"))
      cordova.InAppBrowser.open(event.url, "_self");
    else if (API.onBlank) await API.onBlank(params.apiCtx, event.url);
  });

  ref.addEventListener("beforeload", async (event, cb) => {
    console.log("beforeload", JSON.stringify(event));
    if (API.onBeforeLoad) {
      // handled by our code?
      if (await API.onBeforeLoad(params.apiCtx, event.url))
	return;
    }
    cb(event.url);
  });

  ref.addEventListener("icon", async (event) => {
    if (API.onIcon) await API.onIcon(params.apiCtx, event.icon);
  });

  refs[params.id] = ref;
}

const show = async (id) => {
  await refs[id]?.show();
};

const hide = async (id) => {
  await refs[id]?.hide();
};

const stop = async (id) => {
  await refs[id]?.stop();
};

const reload = async (id) => {
  await refs[id]?.reload();
};

const close = async (id) => {
  if (!(id in refs)) return;

  const ref = refs[id];
  await ref.close();
  delete refs[id];
};

const screenshot = async (id) => {
  if (!(id in refs)) return;

  const ref = refs[id];
  return new Promise((ok) => {
    ref.screenshot((s) => {
      console.log("screenshot", id, s.length);
      ok(s);
    }, 0.4 / window.devicePixelRatio, 1.0);
  });
}

const generateMenu = () => {
  document.body.innerHTML =
    "<div style='border: 1px solid #000; width: 100%, height: 100%; background-color: white;'><button onclick='javascript:parent.nostrCordovaPlugin.setUrl(\"test1\")'>test</button><br><button onclick='javascript:parent.nostrCordovaPlugin.setUrl(\"test2\")'>test2</button></div>";
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
      window.removeEventListener("click", onClick);
    }
  }

  window.addEventListener("click", onClick);
  iframe.addEventListener("click", (e) => {
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
  show,
  close,
  hide,
  stop,
  reload,
  screenshot,
  setAPI,
  showMenu,
};
