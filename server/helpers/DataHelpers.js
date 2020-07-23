module.exports = {
  parseUserBeforeSending: (user) => {
    /*  Addin property on user object doesn't seems to work, so we send a new user  */
    const newUser = {
      id: user._id,
      method: user.method,
      avatar: user.avatar,
      name: user.name,
      bio: user.bio,
    };
    return newUser;
  },
};
