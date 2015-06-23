var playersData = [{name:'will'}, {name:'alex'}];

var express = require('express'),
app = express(),
http = require('http').Server(app),
path = require('path'),
_ = require('underscore'),
io = require('socket.io')(http),
sockets = require('./sockets.js')(io,playersData),
cookieParser = require('cookie-parser'),
session = require('express-session'),
config = require('./config/config.js'),
ConnectMongo = require('connect-mongo')(session),
mongoose = require('mongoose').connect(config.dbURL),
passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy



app.use(cookieParser());
var env = process.env.NODE_ENV || 'development';
if(env==="development"){
	app.use(session({secret:config.sessionsecret, saveUninitialized:true, resave:true}));
}
else{
	app.use(session({
		secret:config.sessionsecret, 
		store: new ConnectMongo({
			mongooseConnection:mongoose.connections[0],
			stringify:true
		}),
		saveUninitialized:true, 
		resave:true}));
}

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname,'public')));

app.set('port', (process.env.PORT || 3000));
require('./routes/routes.js')(express,app,passport,config);


var fs = require("fs");

function readJsonFileSync(filepath, encoding){
    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

function getConfig(file){
    var filepath = __dirname + '/' + file;
    return readJsonFileSync(filepath);
}
model = getConfig('public/model.json');
model = require('./modelprep').prepModel(model);


require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);



io.on('connection', function(socket){
	io.emit('initPuzzle',model);
	var myBoard = model.initialBoardState;
	socket.on('playerAnswer', function(update){
		myBoard = replaceOneChar(myBoard,update[1],update[0]);
		// update[1] = update[1]!=' ';
		socket.broadcast.emit('opUpdate', update);
	});
});

function replaceOneChar(s,c,n){
	var re = new RegExp('^(.{'+ --n +'}).(.*)$','');
	return s.replace(re,'$1'+c+'$2');
};

http.listen(app.get('port'), function(){
	console.log('listening on *:3000');
});
