const User = require('../models/users');

module.exports = {
  register: async (req, res, next) => {
    console.log('AuthController.register()');

    const { email, password } = req.value.body;

    //  Check if a user already exist in database with this email
    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
      return res.status(403).json({ Error: 'Email already in use' });
    }
    const newUser = new User({ email, password });
    await newUser.save();
    res.json({ user: 'Created' });
  },
  login: async (req, res, next) => {
    //  We dont need to validate data here,
    //  PassportJS will do
    console.log('AuthController.login()');
  },
};
