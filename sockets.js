module.exports = function(io, playersData){

	var players = io.of('/players').on('connection',function(socket){
		socket.emit('initPlayerList',JSON.stringify(playersData));
	});
}