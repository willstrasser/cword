module.exports = function(passport, FacebookStrategy, config, mongoose){
	
	var playerUser = new mongoose.Schema({
		profileID:String,
		fullname:String,
		profilePic:String
	});

	var playerModel = mongoose.model('playerUser',playerUser);

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		playerModel.findById(id, function(err, user){
			done(err,user);
		})
	});

	passport.use(new FacebookStrategy({
		clientID: config.fb.appID,
		clientSecret: config.fb.appSecret,
		callbackURL: config.fb.callbackURL,
		profileFields: ['id','displayName','photos']
	},function(accessToken, refreshToken, profile, done){
		playerModel.findOne({'profileID':profile.id}, function(err, result){
			if(result){
				done(null,result);
			}
			else{
				var newPlayerUser = new playerModel({
					profileID:profile.id,
					fullname:profile.displayName,
					profilePic:profile.photos[0].value || ''
				});

				newPlayerUser.save(function(err){
					done(null, newPlayerUser);
				});
			}
		});
	}))
};