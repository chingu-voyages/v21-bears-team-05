const User = require("../models/users");
const { parseUserBeforeSending } = require("../helpers/DataHelpers");

/*  Get an ID, return associated user if found */
const findUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User Not Found" });

    /*  Remove sensible data before sending user back*/
    user = parseUserBeforeSending(user);

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  findUserById,
};
