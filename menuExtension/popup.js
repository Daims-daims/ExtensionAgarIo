// popup.js

let friendList = []

// chrome.storage.local.set({ friendList: [] })

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the friend list from chrome storage
    chrome.storage.local.get(["userName","friendList","SIZE_MAP","COEF_SHRINK","OFFST_X","OFFST_Y","MARGIN_MAP","BALL_SIZE_COEF"], function (result) {
      console.log(result)
      console.log(result.friendList)
      if(result.userName){
        document.getElementById("inputMe").value = result.userName
      }
      if(result.friendList){
        friendList = result.friendList
        friendList.forEach(createDivFriend);  // Display the initial friends
      }
      if(result.COEF_SHRINK){
        updatePicker("coef_shrinkPicker",result.COEF_SHRINK)
      }
      if(result.OFFST_X){
        updatePicker("OffsetXPicker",result.OFFST_X)
      }
      if(result.OFFST_Y){
        updatePicker("OffsetYPicker",result.OFFST_Y)
      }
      if(result.MARGIN_MAP){
        updatePicker("MarginPicker",result.MARGIN_MAP)
      }
      if(result.BALL_SIZE_COEF){
        updatePicker("sizeCoefPicker",result.BALL_SIZE_COEF)
      }
      
    });


    document.getElementById("inputMeButton").onclick = () => {
      const name = document.getElementById("inputMe").value;
      if (name.trim()) { // Avoid empty names
        chrome.storage.local.set({userName:name})
      }
    };

    // Button friend add handler
    document.getElementById("inputFriendButton").onclick = () => {
      const name = document.getElementById("inputFriend").value;
      if (name.trim()) { // Avoid empty names
        addFriend(name, friendList); // Add friend to the list
      }
      document.getElementById("inputFriend").value = ""
    };

    document.getElementById("coef_shrinkPicker").onchange =(evt)=>{
      document.getElementById(evt.currentTarget.id+"LabelValue").innerHTML = evt.currentTarget.value
      updateStorage("COEF_SHRINK",parseInt(evt.currentTarget.value))
    } 

    document.getElementById("OffsetXPicker").onchange =(evt)=>{
      document.getElementById(evt.currentTarget.id+"LabelValue").innerHTML = evt.currentTarget.value
      updateStorage("OFFST_X",parseInt(evt.currentTarget.value))
    } 

    document.getElementById("OffsetYPicker").onchange =(evt)=>{
      document.getElementById(evt.currentTarget.id+"LabelValue").innerHTML = evt.currentTarget.value
      updateStorage("OFFST_Y",parseInt(evt.currentTarget.value))
    } 

    document.getElementById("MarginPicker").onchange =(evt)=>{
      document.getElementById(evt.currentTarget.id+"LabelValue").innerHTML = evt.currentTarget.value
      updateStorage("MARGIN_MAP",parseInt(evt.currentTarget.value))
    } 

    document.getElementById("sizeCoefPicker").onchange =(evt)=>{
      document.getElementById(evt.currentTarget.id+"LabelValue").innerHTML = evt.currentTarget.value
      updateStorage("BALL_SIZE_COEF",parseInt(evt.currentTarget.value))
    } 

  });
  
  function updatePicker(pickerName,value){
    document.getElementById(pickerName).value = value
    document.getElementById(pickerName+"LabelValue").innerHTML = value
  }
  
  function updateStorage(nameColumn,value){
    chrome.storage.local.set({[nameColumn]:value})
  }

  // Add a friend to the list
  function addFriend(name, friendList) {
    friendList.push(name);  // Add the new friend to the list
    // Save the updated list to chrome storage
    chrome.storage.local.set({ friendList: friendList }, function () {
      createDivFriend(name);  // Display the new friend immediately
    });
  }
  
  // Create and display the friend's name
  function createDivFriend(name) {
    const div = document.createElement("div");
    div.innerHTML = name;
    div.onclick = ()=>removeFriend(name,div)
    document.getElementById("rootContent").appendChild(div);
  }
  
  function removeFriend(name,div){
    friendList = friendList.filter(l=>l !== name)
    chrome.storage.local.set({ friendList: friendList })
    div.remove()
  }
