import React from 'react'
import './App.css'
import Login from './components/LoginComponent.js'
import Lobby from './components/LobbyComponent.js'
import {Routes,Route,Redirect,withRouter} from 'react-router-dom'

function App() {
  return (
    <React.Fragment>
      <Login />
      {/* <Lobby /> */}
    </React.Fragment>
  );
}

export default App;
