import logo from '../logo.png';
import React from "react";

function Login(){
    const handleSubmit = (event) => {
        event.preventDefault();
    };
    return(
        <div className="Login">
            <img src={logo} className="App-logo" alt="logo" />
            <br />
            <form onSubmit={handleSubmit} class='form'>
            <label for='uname'>Enter a username: </label>
            <br />
            <input type='text' id='uname' name='uname' placeholder='Eg:- NoobMaster69'/>
            <br />
            <input type='submit' value='PLAY'/>
            </form>
        </div>        
    )
}

export default Login;