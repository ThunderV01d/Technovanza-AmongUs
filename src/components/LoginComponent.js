import logo from '../logo.png';
import React,{useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import {wsurl} from '../App.js'

function Login({onLogin}){
    const [username, setUsername] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const { lastJsonMessage ,sendJsonMessage} = useWebSocket(wsurl,{
        onOpen: () => {
            console.log('Login: WebSocket connection established.');
        },
        share:true,
        filter:false
    });
    //add code to request server if game has started ie:- gameStarted variable from server
    const navigate = useNavigate();

    useEffect(() => {
        if(lastJsonMessage){
            console.log("Client login: ",lastJsonMessage);
            if (lastJsonMessage.type==='startsignal'){
                console.log("client: recieved signal message")
                setGameStarted(lastJsonMessage.data);
                console.log("Client: set game to started state");
            }
        }
    }, [lastJsonMessage]);
    const handleSubmit = (event) => {
        event.preventDefault();
        sendJsonMessage({
            type: "checkGameStarted",
        });
        console.log("client: check message sent")
        if(gameStarted){
            const error_msg = document.getElementsByClassName('error-message');
            error_msg[0].innerHTML = "The game has already started! Please wait";
        }
        else if(!username.trim()) {
            const error_msg = document.getElementsByClassName('error-message');
            error_msg[0].innerHTML = "Please enter a valid username!";
        }
        else{
            const error_msg = document.getElementsByClassName('error-message');
            error_msg[0].innerHTML = "";
            onLogin && onLogin(username);
            navigate('/waiting');
        }
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