custApp = angular.module('angApp', ['ngAnimate']);

custApp.controller('WelcomeController',  function($scope, $http, $window) {

    let host = $window.location.host;

    //all urls
    const URL_GET_USER = "http://"+host+"/getUserById?";
    const URL_GET_USER_RAND = "http://"+host+"/getUserRand";
    const URL_GET_USER_PLANT =  "http://"+host+"/getUserPlant?";
    const URL_GET_TOP_USERS = "http://"+host+"/getTopUser";
    const URL_GET_NOTICES_P = "http://"+host+"/getNoticesPlant";
    const URL_GET_NOTICES_C = "http://"+host+"/getNoticesCompany";
    const URL_GET_Badget_USERS = "http://"+host+"/getBGUser";
    const URL_GET_Point_USERS = "http://"+host+"/getPoint";
    //const URL_GET_EVENTS = "http://"+host+"/getAllEvents"



    // -----------------------------------------------------------all variables
    const urlParams = new URLSearchParams($window.location.search);
    $scope.userId = urlParams.get('user');
    $scope.hideDash = true;
    $scope.user = {};
    $scope.users = [];
    $scope.top10 = [];
    $scope.badget = [];
    $scope.point = [];
    //variables about plants
    const photosArray = document.getElementsByClassName('photo')

    
    //variables about leaderboard
    const rankArray = document.getElementsByClassName('user-rank')
    const badgetArray = document.getElementsByClassName('user-badget')
    const pointArray = document.getElementsByClassName('user-point')

    //get indivual point
    $http.get(URL_GET_Point_USERS).then(function(response){
        $scope.point = response.data[0].UPoints;
        
    })  
    

    //get indivual user info
 
    $http.get(URL_GET_Badget_USERS).then(function(response){
        $scope.badget = response.data;
        let badgetIndex = 0
        $scope.badget.forEach( user =>{
            $scope.user ={...user} 
            console.log(user)
            badgetIndex++;
        })
    })    


    
    //get top 10 users
    $http.get(URL_GET_TOP_USERS).then(function(response){
        $scope.top10 = response.data;
        let rankIndex = 0
        $scope.top10.forEach( user =>{
            let userAvatar = rankArray[rankIndex].querySelector('.rank-avatar')
            let text = rankArray[rankIndex].querySelector('.rank-info')
             userAvatar.style.backgroundImage = "url('/images" + user.UAvatar +"')";
             text.children[0].innerHTML = user.UName
             text.children[1].innerHTML = user.UPoints
             text.children[2].innerHTML = "points"
            rankIndex++;
        })
    })

   



    //--------------------------------------------------------functions triggered by clicking

    //show the different type of notices
    $scope.showPlantNotice = function(){
        const currentNotice = noticeTypes.querySelector('.button-active');

        plantDiv.style.display = 'flex';
        companyDiv.style.display = 'none';
        currentNotice.classList.remove('button-active');
        plantButton.classList.add('button-active');
    }

    $scope.showCompanyNotice = function(){
        const currentNotice = noticeTypes.querySelector('.button-active');

        companyDiv.style.display = 'flex';
        plantDiv.style.display = 'none';
        currentNotice.classList.remove('button-active');
        companyButton.classList.add('button-active');
    }


    //show the different type of events
    $scope.chatEventActive = function(){

        const currentEvent = eventTypes.querySelector('.button-active')

        chatEvent.style.display = "flex";
        sportEvent.style.display = 'none';
        meditationEvent.style.display = 'none';
        currentEvent.classList.remove('button-active');
        chatButton.classList.add('button-active');

    }

    //show the div og sport events
    $scope.sportEventActive = function(){

        const currentEvent = eventTypes.querySelector('.button-active')

        sportEvent.style.display = 'flex';
        chatEvent.style.display = 'none';
        meditationEvent.style.display = 'none';
        currentEvent.classList.remove('button-active');
        sportButton.classList.add('button-active');

    }

    //show the div of meditation events
    $scope.meditationEventActive = function(){

        const currentEvent = eventTypes.querySelector('.button-active')

        meditationEvent.style.display = 'flex';
        sportEvent.style.display = 'none';
        chatEvent.style.display = 'none';
        currentEvent.classList.remove('button-active');
        meditationButton.classList.add('button-active');
    }



})