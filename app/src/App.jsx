import './App.css';

const App = () => {

  const open = async () => {
    var ref = cordova.InAppBrowser.open('https://nostr.band/', '_blank', 'location=yes');
    /*ref.addEventListener('loadstart', async () => {
      console.log(Object.keys(window.nostr))
      console.log("DGFDGFDGDFGDF")
      console.log(Object.keys(cordova.plugins.NostrKeyStore))
      console.log("DGFDGFDGDFGDF1")
    });*/

    //webkit.messageHandlers.cordova_iab.postMessage(stringifiedMessageObj);"

    let NostrKeyStore = {
      getPublicKey: function () {
        return new Promise((resolve, reject) => {
          cordova.plugins.NostrKeyStore.getPublicKey(function (res) {
            resolve(res.pubKey.replaceAll("\"", ""))
          }, function (error) {
            reject(error)
          })
        })
      }, signEvent: function (msg) {
        return new Promise((resolve, reject) => {
          cordova.plugins.NostrKeyStore.signEvent(function (res) {
            resolve(res)
          }, function (error) {
            reject(error)
          }, msg)
        })
      }
    };

    const utils = await fetch("./cordova.js");
    const utils1 = await fetch("./cordova_plugins.js");
    const utils2 = await fetch("./plugins/cordova-plugin-device/www/device.js");
    const utils3 = await fetch("./plugins/cordova-plugin-inappbrowser/www/inappbrowser.js");
    const utils4 = await fetch("./plugins/nostr-keystore-cordova-plugin/www/nostr.js");



    const utilsText = await utils.text();
    const utilsText1 = await utils1.text();
    const utilsText2 = await utils2.text();
    const utilsText3 = await utils3.text();
    const utilsText4 = await utils4.text();




    ref.addEventListener('loadstop', () => {
      ref.executeScript({
        code: utilsText + '; ' + utilsText1 + '; ' + utilsText2 + '; ' + utilsText3 + '; ' + utilsText4 +'; let NostrKeyStore = { getPublicKey: function () { return new Promise((resolve, reject) => { cordova.plugins.NostrKeyStore.getPublicKey( function (res) { resolve(res.pubKey.replaceAll("\\"", "")) },  function (error) {reject(error)})})}, signEvent: function (msg) {return new Promise((resolve, reject) => {cordova.plugins.NostrKeyStore.signEvent(function (res) {resolve(res)}, function (error) {reject(error)}, msg)})}}; window.nostr = NostrKeyStore;'
      }, function () {
        console.log('script injected');
      });
      console.log("DGFDGFDGDFGDFloadstop2")
    });

    ref.show();

  }

    function executeScriptCallBack(obj) {
        console.log("DGFDGFDGDFGDFloadstop3")
      console.log(JSON.stringify(obj))
        console.log("DGFDGFDGDFGDFloadstop4")
    }


  return (
    <div className="App">
      <header className="App-header">
        <button className='btn' id='button1' onClick={() => open()}
        >
          Go to https://nostr.band/
        </button>

      </header>
    </div>
  );
};

export default App;
