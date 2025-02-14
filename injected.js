
(function() {
  var OrigWebSocket = window.WebSocket;
  var callWebSocket = OrigWebSocket.apply.bind(OrigWebSocket);

  window.WebSocket = function WebSocket(url, protocols) {
    var ws;
    if (!(this instanceof WebSocket)) {
      ws = callWebSocket(this, arguments);
    } else if (arguments.length === 1) {
      ws = new OrigWebSocket(url);
    } else if (arguments.length >= 2) {
      ws = new OrigWebSocket(url, protocols);
    } else {
      ws = new OrigWebSocket();
    }

    // Intercept incoming messages
    ws.addEventListener('message', function(event) {
        try{
        let {posX,posY} = getPosFromMessage(event.data)
        console.log("x : "+posX+"\ny : "+posY)
        document.getElementById("custom-absolute-div").innerHTML = "x : "+posX+"\ny : "+posY
        }
        catch{

        }
    });

    return ws;
  }.bind();

  window.WebSocket.prototype = OrigWebSocket.prototype;
  window.WebSocket.prototype.constructor = window.WebSocket;

  // Intercept outgoing messages
  var wsSend = OrigWebSocket.prototype.send;
  OrigWebSocket.prototype.send = function(data) {
    // console.log("Sent:", data);
    const uint = new Uint8Array(data)
    // console.log("uint : ",uint)
    // console.log("Send Decoded (Binary):", new TextDecoder().decode(new Uint8Array(data)));
    return wsSend.apply(this, arguments);
  };
})();

function getPosFromMessage(dataArray){
    const view = new DataView(dataArray)
    let offset = 0
    const type = view.getUint8(offset)
    offset +=1
    msg = ""

    if(type == 16){
		timestamp = +new Date;
		var queueLength = view.getUint16(offset, true);
		offset += 2;
		for (i = 0; i < queueLength; ++i) {
			var killer = nodes[view.getUint32(offset, true)],
				killedNode = nodes[view.getUint32(offset + 4, true)];
			offset += 8;
			if (killer && killedNode) {
				killedNode.destroy();
				killedNode.ox = killedNode.x;
				killedNode.oy = killedNode.y;
				killedNode.oSize = killedNode.size;
				killedNode.nx = killer.x;
				killedNode.ny = killer.y;
				killedNode.nSize = killedNode.size;
				killedNode.updateTime = timestamp;
			}
		}
        var nodeid = view.getUint32(offset, true);
        offset += 4;
        ++i;
        var size, posY, posX = view.getInt16(offset, true);
        offset += 2;
        posY = view.getInt16(offset, true);
        offset += 2;
        size = view.getInt16(offset, true);
        offset += 2;

        console.log(nodeid,posX,posY,size)
        return {posX,posY}

    }
}

function extractNodePositions(buf) {
    var view = new DataView(buf);
    var offset = 3; // Start after the initial 3 bytes (Packet ID and destroy queue length)
  
    var nodePositions = [];
  
    // Read the destroyQueue nodes
    var destroyQueueLength = view.getUint16(1, true); // Destroy queue length (2 bytes)
    offset += destroyQueueLength * 12 + 3; // Skip the destroyQueue data
    
    // Read the nodes data
    var nodesLength = 0;
    // You need to calculate the node data size for the version in your protocol
    for (var i = 0; i < destroyQueueLength; i++) {
      var nodeId = view.getUint32(offset, true);
      var xPosition = view.getUint16(offset + 4, true); // X position
      var yPosition = view.getUint16(offset + 6, true); // Y position
    //   nodePositions.push({ nodeId: nodeId, x: xPosition, y: yPosition });
    //   console.log({ nodeId: nodeId, x: xPosition, y: yPosition });
      offset += 14; // Advance the offset for each node (14 bytes for version 1)
    }
  
    return nodePositions;
  }
  

  console.log("Injecting div...");

  let div = document.createElement("div");
  div.id = "custom-absolute-div";
  div.innerText = "Injected Absolute Div";
  
  // Style the div
  div.style.position = "absolute";
  div.style.top = "50px";   // Adjust Y position
  div.style.left = "50px";  // Adjust X position
  div.style.background = "rgba(0,0,0,0.8)";
  div.style.color = "white";
  div.style.padding = "10px";
  div.style.borderRadius = "5px";
  div.style.zIndex = "9999";
  div.style.fontFamily = "Arial, sans-serif";
  div.style.fontSize = "14px";
  
  // Add it to the body
  document.body.appendChild(div);