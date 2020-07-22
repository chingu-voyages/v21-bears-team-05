const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

/*
router.get("/:id", (req, res) => {
  //  const user = req.user;
  const { id } = req.params;
  User.findUserById(id, res);
});
*/
router.route("/:id").get(UserController.findUserById);
module.exports = router;
