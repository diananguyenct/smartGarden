
let chatForm = document.getElementById('chat-form');
let chatMessages = document.querySelector('.chat-messages');
let roomName = document.getElementById('activityName');
let usersList = document.getElementById('users');
let joinRoom = document.getElementById('joinBtn');
let closeRoom = document.getElementById('leaveBtn');
let backBtn = document.getElementById('backBtn');
let nomActivity=document.getElementById('nomActivity');
closeRoom.disabled=true;
//get userAvatar username activity from URL
let { currentUserId,userAvatar, username, activity } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(currentUserId,userAvatar, username, activity);

let socket = io();
//var socket = io.connect('http://localhost:2500');

// click activity
socket.on('clickActivity', ({ activity }) => {
    outputActivityName(activity);
    outputUsers(users);
    
})

//join button clicked to join activity
joinRoom.addEventListener('click', function (e) {
    socket.emit('joinMe', { currentUserId,userAvatar, username, activity });
    closeRoom.disabled=false
    joinRoom.disabled=true;
    e.target.elements.msg.disabled=false
})

//join activity 
socket.emit('joinActivity', { currentUserId,userAvatar, username, activity });

//get activity and users 
socket.on('activityUsers', ({ activity, users }) => {
    outputActivityName(activity);
    outputUsers(users);
})

//message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down for new messages 
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    //get message text
    let msg = e.target.elements.msg.value;

    //emit message to the server
    socket.emit('chatMessage', msg)

    //clear input text field after emit message to server 
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

//close activity 
closeRoom.addEventListener('click', function (e) {

    history.back()

});

//back button  from activity 
backBtn.addEventListener('click',function(e){
    history.back()
 });

//Output message to DOM
function outputMessage(message) {
    let div = document.createElement('div')
    
    div.classList.add('message');
    div.innerHTML = `<div class="rounded rounded-4 border border-white  shadow p-3 mb-5">


    <div class="row ">
    <p><img  src="${message.userAvatar}" name="userAvatar" style="height:50px;width:50px ; margin-left:10px" class="rounded-circle border border-success shadow p-1 mb-2"> 
    <h6 name="username" class="card-subtitle mb-2 text-muted">${message.username}</h6> <h6 class="card-subtitle mb-2 text-muted" style="margin-left:50px">${message.time}</h6>
    </p>
</div>
<div class="row">
${message.text}
</div>

</div>`;
    document.querySelector('.chat-messages').appendChild(div)
}

//add activity name to DOM

function outputActivityName(room) {
    activityName.innerText = room;
}

//add activity members numbers to DOM
function activityIntro(room){
    nomActivity.innerText=room;
}

//add users to DOM 
function outputUsers(users) {
    usersList.innerHTML = `
    ${users.map(user => `
    <ul style="list-style-type:none"><li class="list-item-group" style="padding-right:70px">
                                    <figure class=" " >
                                        <img id="userAvatar" class="rounded-circle border border-success" src="${user.userAvatar}" name="userAvatar" style="height:60px;width:60px">
                                        <figcaption style="font-size: 15px;font-style:bold;margin-top:5px" id="username" name="username" class="card-subtitle mb-2 text-muted">${user.username}</figcaption>
                             
                                    </figure>
        
                                </li></ul>`).join('')}
    `
        ;

}
