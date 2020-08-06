const User = require("../models/users");
const ErrorHandler = require("../../lib/error");
const {
  parseUserBeforeSending,
  parseDataUserUpdate,
} = require("../helpers/AuthHelpers");

/*  Get an ID, return associated user if found */
const findUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let user = await User.findById(id);

    if (!user) throw new ErrorHandler(404, "User Not Found", error.stack);

    /*  Remove sensible data before sending user back */
    user = parseUserBeforeSending(user);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/*
  Will add or update a User record in database
  with undetermined parameters
*/
const addUserData = async (req, res, next) => {
  try {
    const id = req.params.id;
    const dataUpdate = parseDataUserUpdate(req.body);

    let query = { id: id };
    let update = { $set: dataUpdate };
    let options = { new: true, useFindAndModify: false };

    let resQuery = await User.findOneAndUpdate(query, update, options);
    if (resQuery) {
      const user = parseUserBeforeSending(resQuery);
      return res.status(200).json(user);
    } else {
      throw new ErrorHandler(404, "User Not Found", error.stack);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findUserById,
  addUserData,
};
