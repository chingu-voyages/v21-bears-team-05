const JWT = require('jsonwebtoken');
const User = require('../models/users');
const jwtDecode = require('jwt-decode');

const JWT_SECRET = process.env.JWT_SECRET;

//  Generate a token
//  user: store the user object
//  method: Store the method used to generate
signToken = (user, method) => {
  return JWT.sign(
    {
      iss: 'RecipeApp',
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

    //  Check if a user already exist in database with this email
    let foundUser = await User.findOne({ 'local.email': email });
    if (foundUser) {
      return res.status(403).json({ Error: 'Email already in use' });
    }

    //  Check if there is a Google/Facebook OAUTH with this email
    foundUser = await User.findOne({
      $or: [{ 'google.email': email }, { 'facebook.email': email }],
    });

    //  An Oauth account exist with this email
    if (foundUser) {
      //  Merge
      foundUser.method.push('local');
      foundUser.local = {
        email,
        password,
        name,
        surname,
      };
      await foundUser.save();
      //  Generate the token
      const token = signToken(foundUser, 'local');
      //  Respond with token
      return res.status(200).json({ user: foundUser, token });
    }

    //  Oauth doesnt exist, we create a new user
    const newUser = new User({
      method: ['local'],
      local: {
        email,
        password,
        name,
        surname,
      },
    });
    await newUser.save();

    //  Generate the token
    const token = signToken(newUser, 'local');
    //  Respond with token
    res.status(200).json({ user: newUser, token });
  },
  login: async (req, res, next) => {
    //  Passport give us the user data in req
    const user = req.user;
    //  Generate a token
    const token = signToken(user, 'local');

    res.status(200).json({ user, token });
  },
  facebookOAuth: async (req, res, next) => {
    //  Generate token
    const token = signToken(req.user, 'facebook');
    const user = req.user;
    res.status(200).json({ user, token });
  },
  googleOAuth: async (req, res, next) => {
    const user = req.user;
    //  Generate token
    const token = signToken(user, 'google');
    res.status(200).json({ user, token });
  },
  refresh: async (req, res, next) => {
    const authHeader = req.headers.authorization;
    let oldToken = null;
    //  We decode the token from the user
    if (authHeader.startsWith('Bearer ')) {
      oldToken = jwtDecode(authHeader.substring(7, authHeader.length));
    } else {
      //Error
    }
    const user = req.user;
    //  Generate token
    //  Token is signed with our user and the method used to log him
    const token = signToken(user, oldToken.method);
    res.status(200).json({ user, token });
  },
  protected: async (req, res, next) => {
    res.status(200).json({ msg: 'Access Protected Route ' });
  },
};
