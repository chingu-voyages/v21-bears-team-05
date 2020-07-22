module.exports = {
  parseUserBeforeSending: (user) => {
    user.local = undefined;
    user.google = undefined;
    user.facebook = undefined;
    return user;
  },
};
