import './App.css';

const App = () => {

  const open = async (url) => {
    var ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes');

    ref.addEventListener('loadstop', async (event) => {

      ref.executeScript({
        code: 'window.localStorage.setItem("nostrPluginResponse", ""); let startDateNostrPluginResponse = Date.now(); let timeoutNostrPluginResponse = 100000; let NostrKeyStore = { getPublicKey: function () {webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify({my_message: "this is the message"})); return new Promise(waitForFoo);}, signEvent: function (msg) {return new Promise((resolve, reject) => {cordova.plugins.NostrKeyStore.signEvent(function (res) {resolve(res)}, function (error) {reject(error)}, msg)})}}; window.nostr = NostrKeyStore; console.log("BEFORE"); function waitForFoo(resolve, reject) { let nostrPluginResponse = window.localStorage.getItem("nostrPluginResponse"); console.log(nostrPluginResponse); if (nostrPluginResponse !== "") {console.log("nostrPluginResponse is empty"); resolve(nostrPluginResponse);} else if (timeoutNostrPluginResponse && (Date.now() - startDateNostrPluginResponse) >= timeoutNostrPluginResponse) { console.log("nostrPluginResponse rejected"); reject(new Error("timeout"));} else { console.log("nostrPluginResponse new timeOut"); setTimeout(waitForFoo.bind(this, resolve, reject), 1000);}}'
      }, function () {
        console.log('script injected window nostr');
      });
    });

    ref.addEventListener('message', async (params) => {
      console.log('start getPublicKey')

      if (params.data.my_message === 'this is the message') {

        let publicKey = await window.nostr.getPublicKey()
        publicKey = publicKey.replaceAll("\"", "")

        console.log('publicKey from plugin ' + publicKey);
        let script = 'console.log(window.localStorage.getItem("nostrPluginResponse") + " firstNostrPluginResponse"); window.localStorage.setItem("nostrPluginResponse", "' + publicKey + '"); console.log(window.localStorage.getItem("nostrPluginResponse") + " secondNostrPluginResponse");'
        console.log('script ' + script);
        ref.executeScript({
          code: script
        }, function () {
          console.log('script injected publicKey');
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
