const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;

const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/users');
const { exist } = require('joi');

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
        const user = await User.findOne({ 'local.email': email });

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

//  Google OAUTH Strategy
passport.use(
  'googleToken',
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_CLIENT,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        //  Check if user already exist
        let existingUser = await User.findOne({
          'local.email': profile.emails[0].value,
        });
        //  User already exist in database
        //  Let's merge
        if (existingUser) {
          existingUser.google = {
            id: profile.id,
            email: profile.emails[0].value,
          };
          await existingUser.save();
          return done(null, existingUser);
        }

        //  User doesn't exist, we create an account
        const newUser = new User({
          method: ['google'],
          google: {
            id: profile.id,
            email: profile.emails[0].value,
            name: profile.name.givenName,
            surname: profile.name.familyName,
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
        let existingUser = await User.findOne({ 'facebook.id': profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        existingUser = await User.findOne({
          'local.email': profile.emails[0].value,
        });
        //  User already exist in database
        //  Let's merge
        if (existingUser) {
          existingUser.facebook = {
            id: profile.id,
            email: profile.emails[0].value,
          };
          await existingUser.save();
          return done(null, existingUser);
        }

        //  User doesn't exist, we create an account
        const newUser = new User({
          method: ['facebook'],
          facebook: {
            id: profile.id,
            email: profile.emails[0].value,
            name: profile.name.givenName,
            surname: profile.name.familyName,
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
