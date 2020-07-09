const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('config');
const jwtSecret = config.get('jwtSecret');
const User = require('../server/models/users');

let opts = {};
//  Where we get the token from
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//  Our secret key that we previously used to signed our token
opts.secretOrKey = jwtSecret;

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      //  Find the user specified in token
      const user = await User.findById(payload.sub);

      //  If user doesn't exist
      if (!user) {
        return done(null, false);
      }

      //  Otherwise, return the user
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  })
);
