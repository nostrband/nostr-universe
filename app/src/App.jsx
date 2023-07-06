import './App.css';

const App = () => {

  const openBtn = () => {
    console.log(window.ref)
    const ref = window.ref.open('https://snort.social/global', '_blank', 'location=yes')

    ref.executeScript({ file: "scriptApp.js" });
    ref.addEventListener('loadstart', () => {
      console.log(Object.keys(window.nostr), '!')
    });
    ref.addEventListener('loadstop', function () {

      //   ref.executeScript({
      //     code: `(
      //       function() {
      //         console.log(window.nostr);
      //         console.log(11111111);
      //       })()` })
    });

  }
  return (
    <div className="App">
      <header className="App-header">
        <button className='btn' onClick={openBtn}
        >
          Go to https://snort.social
        </button>

      </header>
    </div>
  );
};

export default App;
