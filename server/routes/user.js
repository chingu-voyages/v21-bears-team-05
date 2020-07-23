const express = require("express");
const router = require("express-promise-router")();

const passport = require("passport");
const passportConf = require("../services/passport");
const passeportJWT = passport.authenticate("jwt", { session: false });

const { validateBody, schemas } = require("../helpers/routeHelpers");
const bodyValidation = validateBody(schemas.authSchema);
const UserController = require("../controllers/user");

//  Route for getting User Data
//  @route GET /users/:id
//  @desc   Return user data from DB
//  @access Public
console.log("Add PassportJS verification to GET /users/:id");
router.route("/:id").get(UserController.findUserById);

//  Route for adding data to User
//  @route POST /users/:id
//  @desc   Add data to User
//  @access Public
router.route("/:id").post(passeportJWT, UserController.addUserData);
module.exports = router;
