const express = require('express');
const router = require('express-promise-router')();

const passport = require('passport');
const passportConf = require('../passport');

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

//  Protected Route for test
//  @route GET /auth/protected
//  @desc   Test if passport strategy work
//  @access Public
router.route('/protected').get(passeportJWT, AuthController.protected);

module.exports = router;