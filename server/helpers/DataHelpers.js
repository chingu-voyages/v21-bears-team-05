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
  /*
    When we wants to update a User record with undefined data
    We update all the properties received in the req.body
    So, we're removing sensible field that should never be changed
  */
  parseDataUserUpdate: (data) => {
    delete data.method;
    delete data.id;
    delete data.local;
    delete data.facebook;
    delete data.google;
    return data;
  },
};
