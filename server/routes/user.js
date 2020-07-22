const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

//  Route for getting User Data
//  @route GET /users/:id
//  @desc   Return user data from DB
//  @access Public
console.log("Add PassportJS verification to GET /users/:id");
router.route("/:id").get(UserController.findUserById);
module.exports = router;
