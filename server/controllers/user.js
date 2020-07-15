const User = require("../models/users");

const findUserById = async (id, res) => {
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User Not Found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  findUserById,
};
