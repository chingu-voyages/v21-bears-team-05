const User = require("../models/users");
const {
  parseUserBeforeSending,
  parseDataUserUpdate,
} = require("../helpers/DataHelpers");

/*  Get an ID, return associated user if found */
const findUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User Not Found" });

    /*  Remove sensible data before sending user back */
    user = parseUserBeforeSending(user);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    let query = { _id: id };
    let update = { $set: dataUpdate };
    let options = { new: true, useFindAndModify: false };

    let resQuery = await User.findOneAndUpdate(query, update, options);
    if (resQuery) {
      return res.status(200).json({ resQuery });
    } else {
      res.status(404).json({ error: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  findUserById,
  addUserData,
};
