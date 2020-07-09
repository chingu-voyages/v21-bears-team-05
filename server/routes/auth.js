const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');
const { validateBody, schemas } = require('../helpers/routeHelpers');
const AuthController = require('../controllers/auth');

//  Route for registering
router
  .route('/register')
  .post(validateBody(schemas.authSchema), AuthController.register);

//  Route for login
router.route('/login').post(AuthController.login);

router
  .route('/protected')
  .get(
    passport.authenticate('jwt', { session: false }),
    AuthController.protected
  );
module.exports = router;
