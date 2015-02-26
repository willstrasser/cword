function prepModel(puz){
	puz.clues.across = _.map(puz.clues.across,function(str,n){
		var clueNum = parseInt(str.substr(0,str.indexOf('.')));
		var firstTile = puz.gridnums.indexOf(clueNum);
		var tilesArr = [];
		for (var i = 0; i<puz.answers.across[n].length; i++) {
			tilesArr.push(i+firstTile);
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
		var tilesArr = [];
		for (var i = 0; i<puz.answers.down[n].length; i++) {
			tilesArr.push((i*15)+firstTile);
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

	// console.log(puz.gridnums);

	return puz;
}