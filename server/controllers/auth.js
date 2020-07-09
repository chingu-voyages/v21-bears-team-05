const config = require('config');
const JWT = require('jsonwebtoken');
const User = require('../models/users');

const jwtSecret = config.get('jwtSecret');

//  Generate a token
signToken = (user) => {
  return JWT.sign(
    {
      iss: 'RecipeApp',
      sub: user.id,
      iat: new Date().getTime(),
      //  Expire in ONE DAY
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    jwtSecret
  );
};

module.exports = {
  register: async (req, res, next) => {
    const { email, password } = req.value.body;

    //  Check if a user already exist in database with this email
    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
      return res.status(403).json({ Error: 'Email already in use' });
    }
    const newUser = new User({ email, password });
    await newUser.save();

    //  Generate the token
    const token = signToken(newUser);

    //  Respond with token
    res.status(200).json({ token: token });
  },
  login: async (req, res, next) => {
    //  We dont need to validate data here,
    //  PassportJS will do
    //  Passport also give us the user data in req

    //  Generate a token
    const token = JWT.signToken(req.user);

    res.status(200).json(token);
  },
  protected: async (req, res, next) => {
    res.status(200).json({ msg: 'Access Protected Route ' });
  },
};
