var express = require('express')
var	app = express();
var http = require('http').Server(app);
var path = require('path');
var _ = require('underscore');
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 3000));
app.use(express.static(path.join(__dirname,'public')));

var fs = require("fs"),
    json;

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
model = prepModel(model);

function prepModel(puz){
	puz.clues.across = _.map(puz.clues.across,function(str,n){
		var clueNum = parseInt(str.substr(0,str.indexOf('.')));
		var firstTile = puz.gridnums.indexOf(clueNum);
		var tilesArr = [firstTile];
		var i=1;
			while (firstTile+i<puz.grid.length && puz.grid[firstTile+i]!=".") {
				tilesArr.push(firstTile+i++);
			};
		return({
			'cluestr':str.substr(str.indexOf('.')+2),
			'dir':'Across',
			'cluenum':clueNum,
			'tiles':tilesArr,
			'key':n
		});
	});

	puz.clues.down = _.map(puz.clues.down,function(str,n){
		var clueNum = parseInt(str.substr(0,str.indexOf('.')));
		var firstTile = puz.gridnums.indexOf(clueNum);
		var tilesArr = [firstTile];
		var i=1;
		while (firstTile+(i*puz.size.cols)<puz.grid.length && puz.grid[firstTile+(i*puz.size.cols)]!=".") {
			tilesArr.push(firstTile+(puz.size.cols*i++));
		};
		return({
			'cluestr':str.substr(str.indexOf('.')+2),
			'dir':'Down',
			'cluenum':clueNum,
			'tiles':tilesArr,
			'key':n
		});
	});

	puz.gridnums = _.map(puz.gridnums,function(i,n){
		var clues = [];
		for (var j = puz.clues.across.length - 1; j >= 0; j--) {
			if(_.contains(puz.clues.across[j].tiles,n)){
				clues.push(puz.clues.across[j]);
				break;
			}
		};
		for (var j = puz.clues.down.length - 1; j >= 0; j--) {
			if(_.contains(puz.clues.down[j].tiles,n)){
				clues.push(puz.clues.down[j]);
				break;
			}
		};

		return({
			'gridnum':i,
			'clues':clues
		})
	});

	return puz;
}

model.initialBoardState = _.map(model.grid,function(tile){
	return tile=='.'?tile:' ';
});
model.initialBoardState = model.initialBoardState.join('');

app.route('/').get(function(req, res, next){
  res.sendFile(path.join(__dirname,'index.html'));
});

io.on('connection', function(socket){
	io.emit('initPuzzle',model);
	var myBoard = model.initialBoardState;
	socket.on('playerAnswer', function(update){
		myBoard = replaceOneChar(myBoard,update[1],update[0]);
		update[1] = update[1]!=' ';
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
