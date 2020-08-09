const passport = require("passport");

const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const FacebookTokenStrategy = require("passport-facebook-token");
const GoogleTokenStrategy = require("passport-google-token").Strategy;

const ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../models/users");
const { exist } = require("joi");

const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET;

const {
  getUserByEmailHashLocal,
  getUserByEmailHashGoogle,
  getUserByEmailHashFacebook,
  getUserByIDHashGoogle,
  getUserByIDHashFacebook,
} = require("../helpers/AuthHelpers");

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
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        //  Return the users that has local in their method field
        const users = await User.find({ method: { $in: ["local"] } });

        //  Check for every users, if local.email hash match with email
        let user = await getUserByEmailHashLocal(users, email);

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
  "googleToken",
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_CLIENT,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        //  Grab the users with facebook and google associated
        let foundGoogle = await User.find({ method: { $in: ["google"] } });
        let foundFacebook = await User.find({ method: { $in: ["facebook"] } });

        //  Check if user already exist
        let existingUser = await getUserByIDHashGoogle(foundGoogle, profile.id);

        if (existingUser) {
          return done(null, existingUser);
        }
        foundGoogle = await getUserByEmailHashGoogle(
          foundGoogle,
          profile.emails[0].value
        );
        foundFacebook = await getUserByEmailHashFacebook(
          foundFacebook,
          profile.emails[0].value
        );

        //  if User already exist from another auth method
        //  Let's merge
        if (foundGoogle) {
          existingUser = foundGoogle;
        }
        if (foundFacebook) {
          existingUser = foundFacebook;
        }

        //  Generate a salt
        const salt = await bcrypt.genSalt(10);

        //  Hash the password
        const idHash = await bcrypt.hash(profile.id, salt);
        const emailHash = await bcrypt.hash(profile.emails[0].value, salt);

        if (existingUser) {
          existingUser.google = {
            id: idHash,
            email: emailHash,
          };
          await existingUser.save();
          return done(null, existingUser);
        }

        //  User doesn't exist, we create an account
        const newUser = new User({
          method: ["google"],
          google: {
            id: idHash,
            email: emailHash,
            //name: profile.name.givenName,
            //surname: profile.name.familyName,
          },
        });
        console.log("user: "+newUser)
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
  "facebookToken",
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        //  Grab the users with facebook and google associated
        let foundGoogle = await User.find({ method: { $in: ["google"] } });
        let foundFacebook = await User.find({ method: { $in: ["facebook"] } });

        //  Check if user already exist
        let existingUser = await getUserByIDHashGoogle(
          foundFacebook,
          profile.id
        );

        if (existingUser) {
          return done(null, existingUser);
        }

        foundGoogle = await getUserByEmailHashGoogle(
          foundGoogle,
          profile.emails[0].value
        );
        foundFacebook = await getUserByEmailHashFacebook(
          foundFacebook,
          profile.emails[0].value
        );

        //  if User already exist from another auth method
        //  Let's merge
        if (foundGoogle) {
          existingUser = foundGoogle;
        }
        if (foundFacebook) {
          existingUser = foundFacebook;
        }

        //  Generate a salt
        const salt = await bcrypt.genSalt(10);

        //  Hash the password
        const idHash = await bcrypt.hash(profile.id, salt);
        const emailHash = await bcrypt.hash(profile.emails[0].value, salt);

        if (existingUser) {
          existingUser.facebook = {
            id: idHash,
            email: emailHash,
          };
          await existingUser.save();
          return done(null, existingUser);
        }

        //  User doesn't exist, we create an account
        const newUser = new User({
          method: ["facebook"],
          facebook: {
            id: idHash,
            email: emailHash,
            //name: profile.name.givenName,
            //surname: profile.name.familyName,
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
