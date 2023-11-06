import logo from '../logo.png';
import React,{useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import {wsurl} from '../App.js'

function Login({onLogin,setGameStarted}){
    const [username, setUsername] = useState('');
    const {sendJsonMessage} = useWebSocket(wsurl,{
        onOpen: () => {
            console.log('Login: WebSocket connection established.');
        },
        share:true,
        filter:false,
        onMessage: (message) => {
            const data = JSON.parse(message.data);
            if (data.type === 'startsignal') {
              console.log('Client: received signal message');
              if (data.data) {
                // Game has started, you can add your logic here
                console.log('Game has started. Handle this case as needed.');
              } else {
                // Game has not started, you can proceed to the waiting page
                onLogin && onLogin(username);
                navigate('/waiting');
              }
            }
          }
    });
    // useEffect(() =>{
    //     const error_msg = document.getElementsByClassName('error-message')[0];
    //     if(submissionValid){
    //         if(gameStarted){
    //             error_msg.innerHTML = "The game has already started! Please wait";
    //         }
    //         else{
    //             onLogin && onLogin(username);
    //             navigate('/waiting');
    //         }
    //     }
    //     else{
    //         error_msg.innerHTML = "Please enter a valid username!";
    //     }
    // },[gameStarted]);
    //add code to request server if game has started ie:- gameStarted variable from server
    
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const error_msg = document.getElementsByClassName('error-message')[0];
        if(!username.trim()) {
            error_msg.innerHTML = "Please enter a valid username!";            
            return;
        }
        sendJsonMessage({
            type: 'checkGameStarted',
        })
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