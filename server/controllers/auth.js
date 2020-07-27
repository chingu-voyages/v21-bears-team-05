const JWT = require("jsonwebtoken");
const User = require("../models/users");
const { parseUserBeforeSending } = require("../helpers/DataHelpers");

const JWT_SECRET = process.env.JWT_SECRET;

//  Generate a token
signToken = (user) => {
  return JWT.sign(
    {
      iss: "RecipeApp",
      sub: user.id,
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
    const foundUser = await User.findOne({ "local.email": email });
    if (foundUser) {
      return res.status(403).json({ Error: "Email already in use" });
    }
    const newUser = new User({
      method: "local",
      local: {
        email,
        password,
        name,
        surname,
      },
    });
    await newUser.save();

    //  Generate the token
    const token = signToken(newUser);
    //  Respond with token
    res.status(200).json({ user: newUser, token });
  },
  login: async (req, res, next) => {
    //  Passport give us the user data in req
    const user = parseUserBeforeSending(req.user);
    //  Generate a token
    const token = signToken(user);

    res.status(200).json({ user, token });
  },
  facebookOAuth: async (req, res, next) => {
    //  Generate token
    const token = signToken(req.user);
    const user = parseUserBeforeSending(req.user);
    res.status(200).json({ user, token });
  },
  googleOAuth: async (req, res, next) => {
    const user = parseUserBeforeSending(req.user);
    //  Generate token
    const token = signToken(user);
    res.status(200).json({ user, token });
  },
  protected: async (req, res, next) => {
    res.status(200).json({ msg: "Access Protected Route " });
  },
};
