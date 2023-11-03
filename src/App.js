import logo from './logo.svg';
import './App.css';

function App() {
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      <br />
      <form onSubmit={handleSubmit} class='form'>
        <label for='uname'>Enter a username: </label>
        <br />
        <input type='text' id='uname' name='uname' placeholder='NoobMaster69'/>
        <br />
        <input type='submit' value='PLAY'/>
      </form>
      </header>
    </div>
  );
}

export default App;
