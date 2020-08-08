const express = require("express");
const router = require("express-promise-router")();

const passport = require("passport");
const passportConf = require("../services/passport");
const passeportJWT = passport.authenticate("jwt", { session: false });

const { validateBody, schemas } = require("../helpers/routeHelpers");
const bodyValidation = validateBody(schemas.userUpdateSchema);
const UserController = require("../controllers/user");

//  Route for getting Current User's Data
//  @route GET /users/
//  @desc   Return user data from DB
//  @access Private
router.route("/active/:uuid").get(passeportJWT, UserController.getUserData);

//  Route for adding data to User
//  @route PUT /users/:id
//  @desc   Add data to User
//  @access Private
router
  .route("/:uuid")
  .put(bodyValidation, passeportJWT, UserController.addUserData);
module.exports = router;

//  Route for getting User Data
//  @route GET /users/:id
//  @desc   Return user data from DB
//  @access Public
router.get("/:uuid", (req, res, next) => {
  UserController.findUserById(req, res, next);
});