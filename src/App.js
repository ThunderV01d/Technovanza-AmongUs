import React, { useEffect, useState } from 'react';
import './App.css'
import Login from './components/LoginComponent.js'
import Lobby from './components/LobbyComponent.js'
import {Routes,Route,Navigate,BrowserRouter} from 'react-router-dom'
import useWebSocket,{ReadyState} from 'react-use-websocket';

const wsurl = 'ws://127.0.0.1:8000';

// function isPlayerEvent(message){
//   let evt = JSON.parse(message.data);
//   return evt.type === 'playerEvent';
// }

function App() {
  const [username, setUsername] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const { sendJsonMessage, readyState} = useWebSocket(wsurl, {
    onOpen: () => {
      console.log('App: WebSocket connection established.');
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true,
    onMessage: (message) => {
      console.log("client login recieved:", message);
      const data = JSON.parse(message.data);
      if (data.type==='startsignal'){
          console.log("client: recieved signal message")
          setGameStarted(data.data);
          console.log("Client: set game to started state");
      }
    }
  });

  useEffect(() => {
    if(username && readyState === ReadyState.OPEN) {
      sendJsonMessage({
        username,
        type: 'playerEvent'
      });
    }
  }, [username, sendJsonMessage, readyState]);

  return (
    <BrowserRouter>
        <Routes>
        <Route path='/play' element={<Login onLogin={setUsername} gameStarted={setGameStarted}/>}/>
        <Route path='/Technovanza-AmongUs' element={<Navigate to ="/play" />} />
        <Route path='' element={<Navigate to ="/play" />} />
        <Route path='/waiting' element={<Lobby  />}/>
        </Routes>
    </BrowserRouter>
  );
}

export {wsurl, App as default};
