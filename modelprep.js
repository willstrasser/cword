var _ = require('underscore');

exports.prepModel = function(puz){
	puz.clues.across = _.map(puz.clues.across,function(str,n){
		var clueNum = parseInt(str.substr(0,str.indexOf('.')));
		var firstTile = puz.gridnums.indexOf(clueNum);
		var tilesArr = [firstTile];
		var i=1;
		var iLimit = Math.floor(firstTile/puz.size.cols+1)*puz.size.cols;
		while (firstTile+i<puz.grid.length && puz.grid[firstTile+i]!="." && firstTile+i<iLimit) {
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
	
	puz.initialBoardState = _.map(puz.grid,function(tile){
		return tile=='.'?tile:' ';
	});
	puz.initialBoardState = puz.initialBoardState.join('');


	return puz;
}