import React from 'react'
import logo from '../logo.png'

function addToTable(){
    document.getElementById('no_players_joined').style.display="none";
    const data = require('../dummy_data.json');
    //console.log(data['players']);
    const length=data['players'].length;
    document.getElementsByTagName('tbody').innerHTML= '';
    var tr = document.createElement('tr');
    for (var i=0;i<length;i++) {
        tr.innerHTML='';
        var td1 = document.createElement('td');
        td1.innerHTML = i+1;
        tr.appendChild(td1);
        var td2 = document.createElement('td');
        td2.innerHTML = data['players'][i]['username'];
        tr.appendChild(td2);
        var td3 = document.createElement('td');
        td3.innerHTML = data['players'][i]['color'];
        tr.appendChild(td3);
        document.getElementsByTagName('tbody')[0].appendChild(tr);
        console.log(tr);
        tr = document.createElement('tr')
    }
}

function Lobby(){
    return(
        <div className="LobbyTable">
            <img src={logo} className="App-logo-small" alt="logo" />
            <br />
            <div id='table-body'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th id='sno'>S.No. </th>
                            <th id='player'>Player</th>
                            <th id='color'>Color</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <h3 id='no_players_joined'>No players have joined yet.</h3>
                <button onClick={addToTable}>PRESS ME</button>
            </div>
        </div>
    )
}

export default Lobby;