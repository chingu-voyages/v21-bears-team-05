const express = require('express');
const router = require('express-promise-router')();

const { validateBody, schemas } = require('../helpers/routeHelpers');
const AuthController = require('../controllers/auth');

//  Route for registering
router
  .route('/register')
  .post(validateBody(schemas.authSchema), AuthController.register);

//  Route for login
router.route('/login').post(AuthController.login);

module.exports = router;
