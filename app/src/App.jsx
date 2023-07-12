import './App.css';

const App = () => {

  const open = async (url) => {
    var ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes');

    ref.addEventListener('loadstop', async () => {

      function methodGetPublicKey() {
        const id = Date.now().toString();
        window.nostrCordovaPlugin.requests[id] = {};

        return new Promise(function (ok, err) {
          window.nostrCordovaPlugin.requests[id] = {
            res: ok,
            rej: err
          }
          webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify({ method: "getPublicKey", id: id }));
        });
      };

      function methodSignEvent(msg) {
        const id = Date.now().toString();
        window.nostrCordovaPlugin.requests[id] = {};

        return new Promise(function (ok, err) {
          window.nostrCordovaPlugin.requests[id] = {
            res: ok,
            rej: err
          }
          webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify({ method: "signEvent", id: id, msg }));
        });
      };

      ref.executeScript({
        code: `window.nostrCordovaPlugin = { requests: {} }; 
        const nostrKey = {getPublicKey: ${methodGetPublicKey}, signEvent: ${methodSignEvent}}; 
        window.nostr = nostrKey;`
      }, function () {
        console.log('script injected window nostr');
      });
    });


    ref.addEventListener('message', async (params) => {
      if (params.data.method === 'getPublicKey') {
        const id = params.data.id.toString()
        const reply = await window.nostr.getPublicKey();
        const jsonReply = JSON.stringify(reply);
        const err = new Error("New error");
        const code = `const req = window.nostrCordovaPlugin.requests[${id}]; 
        if (${jsonReply}) {
          req.res(${jsonReply}); 
        } else {
          req.rej(${JSON.stringify(err)});
        };
        delete window.nostrCordovaPlugin.requests[${id}];
        `;

        ref.executeScript({ code }, function () {
          console.log('script injected publicKey');
        });
      }

      if (params.data.method === 'signEvent') {
        const id = params.data.id.toString()
        const event = await window.nostr.signEvent(params.data.msg);
        const jsonEvent = JSON.stringify(event);
        const err = new Error("New error");
        const code = `const req = window.nostrCordovaPlugin.requests[${id}]; 
        if (${jsonEvent}) {
          req.res(${jsonEvent}); 
        } else {
          req.rej(${JSON.stringify(err)});
        };
        delete window.nostrCordovaPlugin.requests[${id}];`;

        ref.executeScript({ code }, function () {
          console.log('script injected signEvent');
        });
      }

      console.log("message received: " + JSON.stringify(params.data))
    })

  }

  return (
    <div className="App">
      <header className="App-header">
        <button className='btn' id='button1' onClick={() => open('https://nostr.band/')}
        >
          Go to https://nostr.band/
        </button>
        <button className='btn' id='button1' onClick={() => open('https://snort.social/')}
        >
          Go to https://snort.social/
        </button>
        <button className='btn' id='button1' onClick={() => open('https://iris.to/')}
        >
          Go to https://iris.to/
        </button>
        <button className='btn' id='button1' onClick={() => open('https://coracle.social/')}
        >
          Go to https://coracle.social/
        </button>
        <button className='btn' id='button1' onClick={() => open('https://satellite.earth/')}
        >
          Go to https://satellite.earth/
        </button>

      </header>
    </div>
  );
};

export default App;
