const express = require("express");
const router = express.Router();
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
router.route("/:id").post(UserController.addUserData);
module.exports = router;
