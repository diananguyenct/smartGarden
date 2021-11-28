// init server
let express = require('express');

//olivier
let http = require('http');
let app = express();
let server = http.createServer(app);
let socketio = require('socket.io');
let io=socketio(server)
//end olivier

// let socket = require('socket.io');
var bodyParser = require('body-parser');
const axios = require('axios')
const SSH = require('simple-ssh');

//mobile 
//let express = require('express');
let ejs = require('ejs');
//let mysql = require('mysql');



//let socketio = require('socket.io');

//olivier 
let formatMessage = require('./components/js/messages');
let {
    userJoin,
    getCurrentUser,
    userLeave,
    getActivityUsers,
    clickedActivity,
} = require('./components/js/users');
//end olivier


const PORT = process.env.PORT || 5000

app.use(express.static(__dirname + '/'));
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// database configuration
let mysql = require('mysql');

let db = mysql.createConnection(
{
  host: 'localhost',
  user: '21812109',
  password: 'T017F9',
  database: 'db_21812109_2'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

// load routes: define controller which act on db
let routes = require('./components/routes.js');
routes(app, db, axios,io,ejs);

app.use('/images', express.static('images'));
app.use('/controllers', express.static('components/controllers'))
app.use('/views', express.static('components/views'))
app.use('/js', express.static('components/js'))

// mobile part
app.set('views',__dirname + '/components/views')
app.engine('html',ejs.renderFile)
app.set('view engine','html')

server.listen(3010);
