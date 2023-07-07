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


    let NostrKeyStore = {
      getPublicKey: async function () {
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




    ref.addEventListener('loadstop', async (event) => {
      // ref.executeScript({
      //   code: utilsText + '; ' + utilsText1 + '; ' + utilsText2 + '; ' + utilsText3 + '; ' + utilsText4 + '; let NostrKeyStore = { getPublicKey: function () {return new Promise((resolve, reject) => { cordova.plugins.NostrKeyStore.getPublicKey( function (res) { resolve(res.pubKey.replaceAll("\\"", "")); console.log(`key`); },  function (error) {reject(error)})})}, signEvent: function (msg) {return new Promise((resolve, reject) => {cordova.plugins.NostrKeyStore.signEvent(function (res) {resolve(res)}, function (error) {reject(error)}, msg)})}}; window.nostr = NostrKeyStore;'
      // }, function () {
      //   console.log('script injected');
      // });
      ref.executeScript({
        code: 'let NostrKeyStore = { getPublicKey: function () {webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify({my_message: "this is the message"}));}, signEvent: function (msg) {return new Promise((resolve, reject) => {cordova.plugins.NostrKeyStore.signEvent(function (res) {resolve(res)}, function (error) {reject(error)}, msg)})}}; window.nostr = NostrKeyStore;'
      }, function () {
        console.log('script injected');
      });

      console.log("DGFDGFDGDFGDFloadstop2")
    });

    // ref.show();
    ref.addEventListener('message', async (params) => {
      console.log('start getPublicKey')

      if (params.data.my_message === 'this is the message') {

        let publicKey = await window.nostr.getPublicKey()

        // ref.executeScript({
        //   code: "\
        //   var message = '2ab0beeb48b98962edaed475c83305d2f5af5baec07f0c1291379a3703672634';\
        //   var messageObj = {my_message: message};\
        //   var stringifiedMessageObj = JSON.stringify(messageObj);\
        //   webkit.messageHandlers.cordova_iab.postMessage(stringifiedMessageObj);"
        // },
        //   function () {
        //     console.log('script injected1111');
        //   })
      }

      console.log("message received: " + JSON.stringify(params.data))
    })

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
