module.exports = {
  register: async (req, res, next) => {
    //  We need to validate email && password
    console.log('AuthController.register()');
    console.log(req.value.body);
  },
  login: async (req, res, next) => {
    //  We dont need to validate data here,
    //  PassportJS will do
    console.log('AuthController.login()');
  },
};
