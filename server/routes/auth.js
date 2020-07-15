const express = require('express');
const router = require('express-promise-router')();

const passport = require('passport');
const passportConf = require('../services/passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const passeportJWT = passport.authenticate('jwt', { session: false });
const passeportLogin = passport.authenticate('local', { session: false });
const bodyValidation = validateBody(schemas.authSchema);

const AuthController = require('../controllers/auth');

//  Route for registering
//  @route POST /auth/register
//  @desc   Register a user
//  @access Public
router.route('/register').post(bodyValidation, AuthController.register);

//  Route for login
//  @route POST /auth/login
//  @desc   log a user
//  @access Public
router
  .route('/login')
  .post(bodyValidation, passeportLogin, AuthController.login);
//  Route for Facebook OAUTH
//  @route POST /auth/oauth/facebook
//  @desc   authenticate a user
//  @access Public
router
  .route('/oauth/facebook')
  .post(
    passport.authenticate('facebookToken', { session: false }),
    AuthController.facebookOAuth
  );
//  Route for Goole OAUTH
//  @route POST /auth/oauth/google
//  @desc   authenticate a user
//  @access Public
router
  .route('/oauth/google')
  .post(
    passport.authenticate('googleToken', { session: false }),
    AuthController.googleOAuth
  );
//  Route for refreshing token
//  @route GET /auth/refresh
//  @desc   Send a new signed token
//  @access Public
router.route('/refresh').get(passeportJWT, AuthController.refresh);
//  Protected Route for test
//  @route GET /auth/protected
//  @desc   Test if passport strategy work
//  @access Public
router.route('/protected').get(passeportJWT, AuthController.protected);

module.exports = router;
