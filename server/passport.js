const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../server/models/users');

const JWT_SECRET = process.env.JWT_SECRET;

//  JSON WEB TOKENS STRATEGY
//  Authorize User with valid token
let opts = {};
//  Where we get the token from
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//  Our secret key that we previously used to signed our token
opts.secretOrKey = JWT_SECRET;
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

//  Local Strategy
//  Authorize user with valid credentials
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (email, password, done) => {
      try {
        //  Find the user given the email
        const user = await User.findOne({ email });

        //  If no user is found
        if (!user) {
          return done(null, false);
        }

        //  Check if the password is correct
        const isMatch = await user.isValidPassword(password);

        //  If not, handle it
        if (!isMatch) {
          return done(null, false);
        }

        //  Otherwise
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//  Facebook OAUTH Strategy
passport.use(
  'facebookToken',
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ 'facebook.id': profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          method: 'facebook',
          facebook: {
            id: profile.id,
            email: profile.emails[0].value,
          },
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);
