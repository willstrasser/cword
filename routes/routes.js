module.exports = function(express,app, passport){
	var router = express.Router();

	router.get('/',function(req,res,next){
		res.render('index');
	})

	function securePages(req,res,next){
		if(req.isAuthenticated()){
			next();
		}
		else{
			res.redirect('/');
		}
	}

	router.get('/auth/facebook',passport.authenticate('facebook'));
	router.get('/auth/facebook/callback',passport.authenticate('facebook', {
		successRedirect:'/game',
		failureRedirect:'/'
	}))

	router.get('/game',securePages, function(req,res,next){
		res.render('game', {title:"games", user:req.user});
	})

	router.get('/logout', function(req, res, next){
		req.logout();
		res.redirect('/');
	})

	app.use('/', router);
}