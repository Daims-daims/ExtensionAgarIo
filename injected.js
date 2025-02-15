

(function() {
  var OrigWebSocket = window.WebSocket;
  var callWebSocket = OrigWebSocket.apply.bind(OrigWebSocket);

  var allNode = new Set()

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
        // try{
        // let {posX,posY,size} = getPosFromMessage(event.data)
          // div.innerHTML = ""
          // addPoint(posX,posY,size)
          nodeSeen = extractNodePositions(event.data)
          if(nodeSeen){
            allNode.forEach(l=>{
              if(! nodeSeen.map(elem=>elem.id).includes(l)){
                const tmp = document.getElementById("nodeExtension-"+l)
                if(tmp){
                  tmp.remove()
                }
                allNode.delete(l)  
              }
            })
            nodeSeen.forEach(forEachPoint)
          }
        // }
        // catch{

        // }
    
      });

    return ws;
  }.bind();

  function forEachPoint({id,x,y,size,name,isVirus}){
    if(! allNode.has(id)){
      allNode.add(id)
      addPoint(id,x,y,size,name,isVirus)
    }
    else{
      updatePoint(id,x,y,size,name,isVirus)
    }
  }

  window.WebSocket.prototype = OrigWebSocket.prototype;
  window.WebSocket.prototype.constructor = window.WebSocket;

  // Intercept outgoing messages
  var wsSend = OrigWebSocket.prototype.send;
  OrigWebSocket.prototype.send = function(data) {
    const uint = new Uint8Array(data)
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

        return {posX,posY,size}

    }
}

function extractNodePositions(dataArray) {
  const res=[]
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
			// var killer = nodes[view.getUint32(offset, true)],
			// 	killedNode = nodes[view.getUint32(offset + 4, true)];
			offset += 8;
			// if (killer && killedNode) {
			// 	killedNode.destroy();
			// 	killedNode.ox = killedNode.x;
			// 	killedNode.oy = killedNode.y;
			// 	killedNode.oSize = killedNode.size;
			// 	killedNode.nx = killer.x;
			// 	killedNode.ny = killer.y;
			// 	killedNode.nSize = killedNode.size;
			// 	killedNode.updateTime = timestamp;
			// }
		}
  for (var i = 0; ;) {
        var nodeid = view.getUint32(offset, true);
        offset += 4;
        if (0 == nodeid) break;
        ++i;
        var size, posY, posX = view.getInt16(offset, true);
        offset += 2;
        posY = view.getInt16(offset, true);
        offset += 2;
        size = view.getInt16(offset, true);
        offset += 2;
        for (var r = view.getUint8(offset++), g = view.getUint8(offset++), b = view.getUint8(offset++),
             color = (r << 16 | g << 8 | b).toString(16); 6 > color.length;) color = "0" + color;
        var colorstr = "#" + color,
          flags = view.getUint8(offset++),
          flagVirus = !!(flags & 1),
          flagAgitated = !!(flags & 16);
        flags & 2 && (offset += 4);
        flags & 4 && (offset += 8);
        flags & 8 && (offset += 16);
        if (true) {
          for (var char, skin = ""; ;) {
            char = view.getUint8(offset, true);
            offset++;
            if (0 == char) break;
            skin += String.fromCharCode(char);
          }
        }
        for (var char, name = ""; ;) {
          char = view.getUint16(offset, true);
          offset += 2;
          if (0 == char) break;
          name += String.fromCharCode(char)
        }
        
        res.push({id:nodeid,x:posX,y:posY,size:size,name:name,isVirus:flagVirus,flags:[flags,flagVirus,flagAgitated],})
  
      }
      return res
    }
  }
  
  function updateDiv(div,x,y,size,name,isVirus){
    newX = x/COEF_SHRINK + MARGIN_MAP //+OFFST_X
    newY = y/COEF_SHRINK + MARGIN_MAP //+OFFST_Y
    newSize = size / COEF_SHRINK * BALL_SIZE_COEF
    div.style.position = "absolute"
    div.style.left  = newX+"px"
    div.style.top  = newY+"px" 
    div.style.width = newSize+"px";
    div.style.height = newSize+"px";
    div.style.borderRadius =(newSize/2)+"px"
    div.style.background = getColor(name,isVirus);

  }

  function updatePoint(id,x,y,size,name,isVirus){
    updateDiv(document.getElementById("nodeExtension-"+id),x,y,size,name,isVirus)
  }

  function addPoint(idNode,x,y,size,name,isVirus){
    let div = document.createElement("div")
    div.id = "nodeExtension-"+idNode
    updateDiv(div,x,y,size,name,isVirus)
    document.getElementById("map-container").appendChild(div)
  }

  function getColor(name,isVirus){
    if(isVirus){
      return "rgba(0,255,0,0.8)"
    }
    if(name === userName){
      return "rgba(255,255,0,0.8)"
    }
    else if(friendList.includes(name)){
      return "rgba(0,255,255,0.8)"
    }
    return "rgba(255,0,0,0.8)"
    
  }


  const userName = "Oui"

  let friendList = []

  let SIZE_MAP = 30000;
  let COEF_SHRINK = 200;
  
  let OFFST_X = 20;
  let OFFST_Y = 50;
  
  let MARGIN_MAP = 10;

  let BALL_SIZE_COEF = 10

  window.addEventListener("updateConstantes",evt=>{
    const result = evt.detail
    console.log(evt.detail) 
    if(result.friendList){
      friendList= result.friendList
    }
    if(result.SIZE_MAP){
      SIZE_MAP= result.SIZE_MAP
    }
    if(result.COEF_SHRINK){
      COEF_SHRINK= result.COEF_SHRINK
    }
    if(result.OFFST_X){
      OFFST_X= result.OFFST_X
    }
    if(result.OFFST_Y){
      OFFST_Y= result.OFFST_Y
    }
    if(result.MARGIN_MAP){
      MARGIN_MAP= result.MARGIN_MAP
    }
    if(result.BALL_SIZE_COEF){
      BALL_SIZE_COEF= result.BALL_SIZE_COEF
    }
  

    div.style.top = OFFST_Y+ "px";   // Adjust Y position
    div.style.left = OFFST_X + "px";  // Adjust X position
    div.style.width = (MARGIN_MAP*2 + SIZE_MAP/COEF_SHRINK) + "px";
    div.style.height = (MARGIN_MAP*2 + SIZE_MAP/COEF_SHRINK) + "px";
    
  })
  var evt = new CustomEvent('LoadContent');
  window.dispatchEvent(evt);

  let div = document.createElement("div");
  div.id = "map-container";
  
  // Style the div
  div.style.position = "absolute";
  div.style.top = OFFST_X + "px";   // Adjust Y position
  div.style.left = OFFST_Y + "px";  // Adjust X position
  div.style.width = (MARGIN_MAP*2 + SIZE_MAP/COEF_SHRINK) + "px";
  div.style.height = (MARGIN_MAP*2 + SIZE_MAP/COEF_SHRINK) + "px";
  div.style.background = "rgba(0,0,0,0.8)";
  div.style.padding = MARGIN_MAP+"px";
  div.style.borderRadius = "5px";
  div.style.zIndex = "9999";
  document.body.appendChild(div);
