import logo from '../logo.png';
import React,{useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import {wsurl} from '../App.js'

function Login({onLogin}){
    const [username, setUsername] = useState('');
    const [gameStarted,setGameStarted] = useState(false);
    const {sendJsonMessage,lastJsonMessage} = useWebSocket(wsurl,{
        onOpen: () => {
            console.log('Login: WebSocket connection established.');
        },
        share:true,
        filter:false,
    });
    useEffect(() => {
        const error_msg = document.getElementsByClassName('error-message')[0];
        if (lastJsonMessage) {
          console.log("Login Page received: ", lastJsonMessage);
          if (lastJsonMessage.type === 'checkGameStarted') {
            console.log("Game STARTED: ", lastJsonMessage.data);
            setGameStarted(lastJsonMessage.data);
            
            // Handle the logic here after receiving the server response
            if (lastJsonMessage.data) {
              error_msg.innerHTML = "The game has already started! Please wait";
            } else {
              onLogin && onLogin(username);
              navigate('/waiting');
            }
          }
        }
      }, [lastJsonMessage]);
      
    // add code to request server if game has started ie:- gameStarted variable from server
    
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const error_msg = document.getElementsByClassName('error-message')[0];
        if (!username.trim()) {
          error_msg.innerHTML = "Please enter a valid username!";
          return;
        }
        sendJsonMessage({
          type: 'checkGameStarted',
        });
      };
      
    return(
        <div className="Login">
            <img src={logo} className="App-logo" alt="logo" />
            <br />
            <form onSubmit={handleSubmit} className='form'>
            <label htmlFor='uname'>Enter a username: </label>
            <br />
            <input type='text' id='uname' name='uname' placeholder='Eg:- HungoverKitten' onInput={(e) => setUsername(e.target.value)}/>
            <br />
            <input type='submit' value='PLAY'/>
            <p className='error-message'></p>
            </form>
        </div>  
    )
}

export default Login;