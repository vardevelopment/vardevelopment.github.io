var client = io();  
var playerStarted = false;

//Client --> Server
    
function SocketSend(data) {
    if (data.type == 'Connect') {
        data.siteUrl = window.location.href;
    }
    
    client.emit('socketSend', JSON.parse(data));
}

//Server --> Client
        
client.on('serverMessage', function(data) {   
    if (data.type == 'ConnectionResponse') {
        playerStarted = true;
    }
    
    if (playerStarted == false) { return; }

    networkMessage(data);
});
  
//Unity Functions

function networkMessage(data) {
    var messageData = JSON.stringify(data);
    gameInstance.SendMessage("Network", data.type, messageData);
}