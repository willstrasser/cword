var express = require('express')
var	app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 3000));
console.log('port is'+process.env.PORT);
app.use(express.static(path.join(__dirname,'public')));

app.route('/').get(function(req, res, next){
  res.sendFile(path.join(__dirname,'index.html'));
});

io.on('connection', function(socket){
  socket.on('playerAnswer', function(msg){
  	console.log('yooooo');
    io.emit('updateAnswer', msg);
  });
});

http.listen(app.get('port'), function(){
  console.log('listening on *:3000');
});
