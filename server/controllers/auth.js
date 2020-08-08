const JWT = require("jsonwebtoken");
const User = require("../models/users");
const jwtDecode = require("jwt-decode");
const JWT_SECRET = process.env.JWT_SECRET;

const {
  getUserByEmailHashLocal,
  getUserByEmailHashGoogle,
  getUserByEmailHashFacebook,
  parseUserBeforeSending,
} = require("../helpers/AuthHelpers");

//  Generate a token
//  user: store the user object
//  method: Store the method used to generate
signToken = (user, method) => {
  return JWT.sign(
    {
      iss: "RecipeApp",
      sub: user.id,
      method: method,
      iat: new Date().getTime(),
      //  Expire in ONE DAY
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    JWT_SECRET
  );
};

module.exports = {
  register: async (req, res, next) => {
    const { email, password, name, surname } = req.value.body;

    //  Return the users that has local in their method field
    const users = await User.find({ method: { $in: ["local"] } });

    //  Check for every users, if local.email hash match with email
    //  Check if a user already exist in database with this email
    let foundUser = await getUserByEmailHashLocal(users, email);

    if (foundUser) {
      return res.status(403).json({ Error: "Email already in use" });
    }

    //  Grab the users with facebook and google associated
    let foundGoogle = await User.find({ method: { $in: ["google"] } });
    let foundFacebook = await User.find({ method: { $in: ["facebook"] } });

    //  Check the users data
    foundGoogle = await getUserByEmailHashGoogle(foundGoogle, email);
    foundFacebook = await getUserByEmailHashFacebook(foundFacebook, email);

    if (foundGoogle) {
      foundUser = foundGoogle;
    }
    if (foundFacebook) {
      foundUser = foundFacebook;
    }

    //  An Oauth account exist with this email
    if (foundUser) {
      //  Fill the local field of the user
      foundUser.method.push("local");
      foundUser.local = {
        email,
        password,
        name,
        surname,
      };
      await foundUser.save();
      //  Generate the token
      const token = signToken(foundUser, "local");

      //  Respond with token
      /*  Delete password property on user */
      const user = parseUserBeforeSending(foundUser);
      return res.status(200).json({ user, token });
    }

    //  Oauth doesnt exist, we create a new user
    const newUser = new User({
      method: ["local"],
      local: {
        email,
        password,
        name,
        surname,
      },
    });
    await newUser.save();

    //  Generate the token
    const token = signToken(newUser, "local");

    //  Respond with token
    const user = parseUserBeforeSending(newUser);
    res.status(200).json({ user, token });
  },
  login: async (req, res, next) => {
    //  Passport give us the user data in req
    const user = parseUserBeforeSending(req.user);
    //  Generate a token
    const token = signToken(user, "local");

    res.status(200).json({ user, token });
  },
  facebookOAuth: async (req, res, next) => {
    //  Generate token
    const token = signToken(req.user, "facebook");
    const user = parseUserBeforeSending(req.user);

    res.status(200).json({ user, token });
  },
  googleOAuth: async (req, res, next) => {
    //  Generate token
    const token = signToken(req.user, "google");
    const user = parseUserBeforeSending(req.user);
    
    res.status(200).json({ user, token });
  },
  refresh: async (req, res, next) => {
    const authHeader = req.headers.authorization;
    let oldToken = null;
    //  We decode the token from the user
    if (authHeader.startsWith("Bearer ")) {
      oldToken = jwtDecode(authHeader.substring(7, authHeader.length));
    } else {
      //Error
    }
    const user = parseUserBeforeSending(req.user);

    //  Generate token
    //  Token is signed with our user and the method used to log him
    const token = signToken(user, oldToken.method);
    res.status(200).json({ user, token });
  },
  protected: async (req, res, next) => {
    res.status(200).json({ msg: "Access Protected Route " });
  },
};
