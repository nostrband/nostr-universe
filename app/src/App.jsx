import './App.css';

const App = () => {

  const open = () => {
    var ref = cordova.InAppBrowser.open('https://nostr.band/', '_blank', 'location=yes');
    ref.addEventListener('loadstart', () => {
      console.log(Object.keys(window.nostr))
    });
  }


  return (
    <div className="App">
      <header className="App-header">
        <button className='btn' onClick={() => open()}
        >
          Go to https://nostr.band
        </button>

      </header>
    </div>
  );
};

export default App;
