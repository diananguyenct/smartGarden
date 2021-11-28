

let users = []

//Join user to activity 
function clickedActivity(currentUserId,userAvatar,username,activity){
    let clickedActivity = {currentUserId,userAvatar,username,activity};
    return clickedActivity;
}

//Join user to activity chat
function userJoin(currentUserId,userAvatar,username,activity){
    let user = {currentUserId,userAvatar,username,activity};

    users.push(user);

    return user;
}

//get current user
function getCurrentUser(currentUserId){
    return users.find(user => user.currentUserId=== currentUserId);
}

//user leaves chat 

function userLeave(currentUserId){

    let index = users.findIndex(user => user.currentUserId === currentUserId);

    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

//get activity users 

function getActivityUsers(activity){
    return users.filter(user => user.activity == activity);
}

module.exports ={
    userJoin,
    getCurrentUser,
    userLeave,
    getActivityUsers,
    clickedActivity
};