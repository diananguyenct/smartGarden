module.exports = (app, db, axios, io) => {


        let formatMessage = require('./js/messages');
        let {
            userJoin,
            getCurrentUser,
            userLeave,
            getActivityUsers,
            clickedActivity,
        } = require('./js/users');
        // send the start page of web app
        app.get('/', function (req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.sendFile(__dirname + '/views' + '/start.html');
        });

        //send the welcome page 
        app.get('/welcome', function (req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.sendFile(__dirname + '/views' + '/welcome.html');
        });
        //send profile page
        app.get('/profile', function (req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.sendFile(__dirname + '/views' + '/profile.html');
        })

        //require db (TESTED)
        app.get('/getUsers', function (req, res) {
            let sql = 'SELECT * FROM Users';
            let processSQL = function (err, result) {
                if (err) throw err;
                res.json(result);
            };
            db.query(sql, processSQL);
        })

        //get user by email (tested)
        app.get('/getUser', function (req, res) {
            let email = (req.query.email)

            let sql = 'SELECT * FROM Users WHERE UEmail = ?';
            values = [email]

            let processSQL = function (err, result) {
                if (err) throw err;
                res.json(result);
            };
            db.query(sql, values, processSQL);
        })

        //get user by Id(tested)
        app.get('/getUserById', function (req, res) {

            let userId = (req.query.userId)

            let sql = 'SELECT * FROM Users WHERE UserId = ?';
            values = [userId]

            let processSQL = function (err, result) {
                if (err) throw err;
                res.json(result);
            };
            db.query(sql, values, processSQL);

        })

        //select randomly 9 users(TD)
        app.get('/getUserRand', function (req, res) {

            let sql = 'SELECT UserId, UName, UAvatar FROM Users ORDER BY RAND() DESC LIMIT 9'
            let processSQL = function (err, result) {
                if (err) throw err;
                res.json(result);
            };
            db.query(sql, processSQL);
        })

        // get the name and a latest photo of one of the plants of user demanded(TD)
        app.get('/getUserPlant', function (req, res) {

            let UserId = (req.query.UserId)
            let sql = 'SELECT p1.PName, p2.Address FROM Plants p1 INNER JOIN PlantPhotos p2 ON p1.PlantId = p2.PlantId WHERE p1.UserId= ? ORDER BY p2.Date DESC LIMIT 1'
            let values = [UserId]
            let processSQL = function (err, result) {
                if (err) throw err;
                res.json(result);
            };
            db.query(sql, values, processSQL);
        })

        //get top 10 users(TD)
        app.get('/getTopUser', function (req, res) {

            let sql = 'SELECT UName, UAvatar,UPoints FROM Users ORDER BY UPoints DESC LIMIT 10'
            let processSQL = function (err, result) {
                if (err) throw err;
                res.json(result);
            };
            db.query(sql, processSQL);
        })

        //get notices about plant.(TD)
        app.get('/getNoticesPlant', function (req, res) {

            let sql = 'SELECT p.PlantId, p.PName, p.PLocation FROM Plants p INNER JOIN Notices n ON p.PlantId = n.PlantId WHERE n.NType = "plant" ORDER BY n.NDate ASC'
            let processSQL = function (err, result) {
                if (err) throw err;
                res.json(result);
            };
            db.query(sql, processSQL);
        })

        //get notices about company.(TD)
        app.get('/getNoticesCompany', function (req, res) {

            let sql = 'SELECT NContent FROM NOtices WHERE NType = "company" ORDER BY NDate DESC'
            let processSQL = function (err, result) {
                if (err) throw err;
                res.json(result);
            };
            db.query(sql, processSQL);
        })

        //get all events()
        app.get('/getAllEvents', function (req, res) {
            let sql = 'SELECT * FROM Events ORDER BY EDate ASC'
            let processSQL = function (err, result) {
                if (err) throw err;
                res.json(result);
            };
            db.query(sql, processSQL);
        })
        //------------------------- Define routes for Rasp Pi-------------------------
        app.get('/getAllImages', function (req, res) {
            // function to ssh into a remote host.
            function ssh(host, user, password) {

                console.log('inside the system')
                var ssh_options = new SSH({
                    host: '10.2.220.108',
                    user: 'pi',
                    pass: 'miage2is'
                });
                // execute the df -h command to find out disk utilization
                ssh.exec('python bin/camera.py', {
                    out: function (stdout) {
                        parse(stdout);
                    }
                }).start();
            }
        })

        //------------------------- Dashboard routes-------------------------
        app.get('/sentmentanalysis', function (req, res) {
            // send the main (and unique) page
            res.setHeader('Content-Type', 'text/html');
            res.sendFile(__dirname + '/views' + '/sentiment-report.html');
        });

        app.get('/ngSentimentReport.js', function (req, res) {
            // send the angular app
            res.setHeader('Content-Type', 'application/javascript');
            res.sendFile(__dirname + '/js' + '/ngSentimentReport.js');
        });

        app.get('/getAllComments', function (req, res) {

            let sqlSelectComments = `
            SELECT comm.rating, comm.comContent, comm.sentimentClass, comm.topic, comm.createTime, comm.userId, user.UName
            FROM comments comm LEFT JOIN Users user ON (comm.userId = user.userId)
            ORDER BY 5 DESC`;

            // response contains a json array with all tuples
            let postProcessSQL = function (err, result) {
                if (err) throw err;

                res.json(result);
            };
            db.query(sqlSelectComments, postProcessSQL);
        });

        app.get('/getAllUsers', function (req, res) {

            let sqlSelectUsers = 'SELECT UserId, UName, UPosition FROM Users';

            // response contains a json array with all tuples
            let postProcessSQL = function (err, result) {
                if (err) throw err;

                res.json(result);
            };
            db.query(sqlSelectUsers, postProcessSQL);
        });

        /* 
            //prepare API classification sentiment of inserting comments for Olivier
            app.get('/insertComm', function (req, res) {
            const commentContent = "I love my children";
    
            axios.post("https://sentim-api.herokuapp.com/api/v1/", {
                text: commentContent,
            })
                .then((res) => {
                    let sentiment = res.data.result.type;
                    let rating = 1;
                    let comContent = commentContent;
                    let sentimentClass = `${sentiment.charAt(0).toUpperCase()}${sentiment.slice(1)}`;
                    let topic = "Love";
                    let userId = 1;
                    const today = new Date();
                    const formattedDate = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
                    const formattedTime = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
                    let sqlInsertComment = `INSERT INTO comments(rating, comContent, sentimentClass, topic, userId, createTime) 
                                                                VALUES(?, ?, ?, ?, ?, ?)`;
                    let values = [rating, comContent, sentimentClass, topic, userId, today];
                    // create a json object containing the inserted customer
                    let postProcessInsert = function (err, result) {
                        if (err) throw err;
                        //res.json({id: result.insertId, comContent: comContent, sentimentClass: sentimentClass, topic: topic, userId: userId, today: today, insertedLines: result.affectedRows });
                    };
                    db.query(sqlInsertComment, values, postProcessInsert);
                })
                .catch((error) => {
                    console.log(error);
                })
    
            // send the main (and unique) page
            res.setHeader('Content-Type', 'text/html');
            res.sendFile(__dirname + '/views' + '/insertComm.html');
        }); */

        app.get('/insComm.js', function (req, res) {
            // send the angular app
            res.setHeader('Content-Type', 'application/javascript');
            res.sendFile(__dirname + '/js' + '/insComm.js');
        });

        app.get('/insComment', function (req, res) {
            let rating = (req.query.newRating);
            let comContent = (req.query.newComContent);
            let sentimentClass = (req.query.newSentimentClass);
            let topic = (req.query.newTopic);
            let userId = (req.query.userId);
            const today = new Date();
            const formattedDate = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
            const formattedTime = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

            let sqlInsertComment = 'INSERT INTO comments(rating, comContent, sentimentClass, topic, userId, createTime) VALUES(?, ?, ?, ?, ?, ?)';

            let values = [rating, comContent, sentimentClass, topic, userId, today];
            // create a json object containing the inserted customer
            let postProcessInsert = function (err, result) {
                if (err) throw err;
                res.json({ id: result.insertId, rating: rating, comContent: comContent, sentimentClass: sentimentClass, topic: topic, userId: userId, today: today, insertedLines: result.affectedRows });
            };
            db.query(sqlInsertComment, values, postProcessInsert);
        });

        ///Define route for chart 
        app.get('/lineYearRating', function (req, res) {

            let sqlSelectRatingbyYear1 = `
        SELECT date_format(RatingEvent.createdDate, '%Y') AS _year, date_format(createdDate, '%M') AS _month, count(*) AS No, RatingEvent.createdDate
        FROM RatingEvent 
        LEFT JOIN RatingType ON (RatingEvent.ratingId = RatingType.ratingId)
        WHERE RatingType.ratingName IN ('Angry', 'Negative')
        GROUP BY year(RatingEvent.createdDate),  month(RatingEvent.createdDate)
        ORDER BY RatingEvent.createdDate ASC`;

            let sqlSelectRatingbyYear2 = `
        SELECT date_format(RatingEvent.createdDate, '%Y') AS _year, date_format(createdDate, '%M') AS _month, count(*) AS No, RatingEvent.createdDate
        FROM RatingEvent 
        LEFT JOIN RatingType ON (RatingEvent.ratingId = RatingType.ratingId)
        WHERE RatingType.ratingName IN ('Neutral')
        GROUP BY year(RatingEvent.createdDate), month(RatingEvent.createdDate)
        ORDER BY RatingEvent.createdDate ASC`;

            let sqlSelectRatingbyYear3 = `
        SELECT date_format(RatingEvent.createdDate, '%Y') AS _year, date_format(createdDate, '%M') AS _month, count(*) AS No, RatingEvent.createdDate
        FROM RatingEvent 
        LEFT JOIN RatingType ON (RatingEvent.ratingId = RatingType.ratingId)
        WHERE RatingType.ratingName IN ('Love', 'Like')
        GROUP BY year(RatingEvent.createdDate), month(RatingEvent.createdDate)
		ORDER BY RatingEvent.createdDate ASC`;

            // retrieve 3 querries 
            db.query(sqlSelectRatingbyYear1, function (err, rows1) {
                if (err) throw err;
                db.query(sqlSelectRatingbyYear2, function (err, rows2) {
                    if (err) throw err;
                    db.query(sqlSelectRatingbyYear3, function (err, rows3) {
                        if (err) throw err;
                        res.json({ negative: rows1, neutral: rows2, positive: rows3 })
                    });
                });
            });

        });

        app.get('/barMonthRating', function (req, res) {

            let sqlSelectRatingbyMonth = `
        SELECT date_format(createdDate, '%M') AS _month, RatingType.ratingName, count(*) AS No, RatingType.ratingId
        FROM RatingEvent 
        LEFT JOIN RatingType ON (RatingEvent.ratingId = RatingType.ratingId)
        WHERE month(RatingEvent.createdDate)= MONTH(CURRENT_DATE())
        GROUP BY RatingType.ratingName
		ORDER BY RatingType.ratingId ASC;`;

            // response contains a json array with all tuples
            let postProcessSQL = function (err, result) {
                if (err) throw err;

                res.json(result);
            };
            db.query(sqlSelectRatingbyMonth, postProcessSQL);
        });

        //------------------------- mobile routes-------------------------
        // get login page  
        app.get('/userLogin', function (req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.render('index_mob.html');
        })
        // login process 
        app.get('/login', function (req, res) {
            let user = (req.query.username);
            let password = (req.query.password);
            //search the user corresponding to username and password
            let sqlQuery = 'SELECT UserId,UName,UAvatar,UPoints FROM Users WHERE UName=? AND UPwd=?';
            let values = [user, password];
            let postSQL = function (err, result) {
                if (err) throw err;
                id = result[0].UserId;
                //query to select the plant corresponding to the logged user
                queryPlant = 'SELECT PName,PAvatar,PTemp,Phumidity,Pmoisture,minTemp,maxTemp,minHumidity,maxHumidity,minMoisture,maxMoisture FROM Plants WHERE UserId=?';
                queryValues = (id);
                db.query(queryPlant, queryValues, (err, results) => {
                    if (err) throw err;
                    queryEvents="SELECT EName,EPic FROM Events ORDER BY RAND() DESC LIMIT 4";
                    db.query(queryEvents,(err,events)=>{
                        if(err) throw err;
                        queryTips = "SELECT tipContent FROM tips ORDER BY RAND() DESC LIMIT 1";
                        db.query(queryTips,(err,tips)=>{
                            if(err)throw err;
                            res.setHeader('Content-Type', 'text/html');
                            res.render('home_mob.html', {
                                userId: result[0].UserId, username: result[0].UName,
                                avatar: result[0].UAvatar, points: result[0].UPoints, temp: results[0].PTemp,
                                humidity: results[0].Phumidity, moisture: results[0].Pmoisture,
                                plantName: results[0].PName, plantAvatar: results[0].PAvatar,
                                minTemp: results[0].minTemp, maxTemp: results[0].maxTemp, minHum: results[0].minHumidity,
                                maxHum: results[0].maxHumidity, minMoist: results[0].minMoisture, maxMoist: results[0].maxMoisture,
                                events:events,tips:tips
                            });
                        })
                       
                    })
                   
                })

            }
            db.query(sqlQuery, values, postSQL)
        })

        //-------------------leader board route--------------//
        app.get('/board_mobile',function(req,res){
            let userId = (req.query.currentUserId);
            let queryLeader = "SELECT UName,UAvatar,UPoints,ULevel FROM Users WHERE UserId=?";
            let valueId = [userId]
            let postLeaderQuery = function(err,result){
                if(err) throw err;
                queryTopUsers="SELECT UName, UAvatar,UPoints FROM Users ORDER BY UPoints DESC LIMIT 10"
                db.query(queryTopUsers,(err,results)=>{
                    if(err) throw err;
                    res.setHeader('Content-Type','text/html');
                    res.render('leader.html',{users:results,username: result[0].UName,points:result[0].UPoints,
                                            userAvatar:result[0].UAvatar,userLevel:result[0].ULevel})
                })
                
            }
            db.query(queryLeader,valueId,postLeaderQuery)
        })


        //activity route 
        app.get('/activity', function (req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.render('activity_mob.html')
        })

        //home route 
        app.get('/home_mob', function (req, res) {
            res.setHeader('Content-Type', 'text/html');
            let user = (req.query.username);
            let avatar = (req.query.userAvatar);
            res.render('home_mob.html', { username: user, userAvatar: avatar })
        })

        //create a chat bot name to welcome new users in chat
        let botName = 'ChatBot';
        let botAvatar = 'userAvatar';

        //run when client click on an activity

        io.on('connection', socket => {

            socket.on('joinActivity', ({ currentUserId, userAvatar, username, activity }) => {
                let usersNum = {};
                let user = clickedActivity(currentUserId, userAvatar, username, activity);
                socket.join(user.activity);

                //then display the activity
                io.to(user.activity)
                    .emit('activityUsers', {
                        activity: user.activity,
                        users: getActivityUsers(user.activity)
                    });

                socket.on('joinMe', ({ currentUserId, userAvatar, username, activity }) => {
                    let user = userJoin(currentUserId, userAvatar, username, activity);
                    socket.join(user.activity);
                    if (usersNum[user.activity] == undefined) {
                        usersNum[user.activity] = 1;
                        console.log(usersNum)
                    } else {
                        usersNum[user.activity]++;
                        console.log(usersNum)
                    }
                    //welcome the current user 
                    socket.emit('message', formatMessage('/images/icon/chatbot.png', `Welcome ${user.username}`, '', ''));

                    //broadcast to all connected user when the new user connects
                    socket.broadcast
                        .to(user.activity)
                        .emit('message', formatMessage('/images/icon/chatbot.png', `${user.username} has joined`, ''));

                    //overwrite active users 
                    io.to(user.activity)
                        .emit('activityUsers', {
                            activity: user.activity,
                            users: getActivityUsers(user.activity)
                        });
                })
                //Listen for chatMessage 
                socket.on('chatMessage', msg => {
                    //emit message to all users 
                    let user = getCurrentUser(currentUserId);
                    io.to(user.activity)
                        .emit('message', formatMessage(user.userAvatar, user.username, msg));

                    //sending the message to DB with axios library,then analyse sentiment
                    axios.post("https://sentim-api.herokuapp.com/api/v1/", {
                        text: msg,
                    })
                        .then((res) => {
                            let sentiment = res.data.result.type;
                            let rating = 5;
                            let comContent = msg;
                            let sentimentClass = `${sentiment.charAt(0).toUpperCase()}${sentiment.slice(1)}`;
                            let topic = user.activity;
                            let userId = currentUserId;
                            const today = new Date();
                            const formattedDate = `${today.getFullYear}-${today.getMonth()}-${today.getDate()}`;
                            const formattedTime = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
                            let sqlInsertComment = `INSERT INTO comments(rating, comContent, sentimentClass, topic, userId, createTime) 
                                                            VALUES(?, ?, ?, ?, ?, ?)`;
                            let values = [rating, comContent, sentimentClass, topic, userId, today];
                            // let queryMessage = `INSERT INTO comments (comContent,userId);
                            //     VALUES (?,?)`;
                            let valuesmessageValues = [msg, currentUserId];
                            let postProcessInsertMessage = function (err, res) {
                                if (err) throw err;
                            }
                            db.query(sqlInsertComment, values, postProcessInsertMessage);
                        })

                });

                //runs when user disconnects 
                socket.on('disconnect', () => {
                    let user = userLeave(currentUserId);
                    usersNum[user.activity]--;
                    console.log(usersNum);
                    if (user) {
                        io.to(user.activity)
                            .emit('message', formatMessage('/images/icon/chatbot.png', `${user.username} has left the chat`, ''));

                        //send users and activity info
                        io.to(user.activity)
                            .emit('activityUsers', {
                                activity: user.activity,
                                users: getActivityUsers(user.activity)
                            });

                    }
                });
            })
        });





}