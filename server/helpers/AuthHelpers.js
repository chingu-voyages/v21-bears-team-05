module.exports = {
  getUserByEmailHashLocal: async (users, email) => {
    for (const userInDb of users) {
      let validEmail = await userInDb.isValidEmailLocal(email);
      if (validEmail) {
        return userInDb;
      }
    }
    return null;
  },
  getUserByEmailHashGoogle: async (users, email) => {
    for (const userInDb of users) {
      let validEmail = await userInDb.isValidEmailGoogle(email);
      if (validEmail) {
        return userInDb;
      }
    }
    return null;
  },
  getUserByEmailHashFacebook: async (users, email) => {
    for (const userInDb of users) {
      let validEmail = await userInDb.isValidEmailFacebook(email);
      if (validEmail) {
        return userInDb;
      }
    }
    return null;
  },
  getUserByIDHashGoogle: async (users, email) => {
    for (const userInDb of users) {
      let validEmail = await userInDb.isValidIDGoogle(email);
      if (validEmail) {
        return userInDb;
      }
    }
    return null;
  },
  getUserByIDHashFacebook: async (users, email) => {
    for (const userInDb of users) {
      let validEmail = await userInDb.isValidIDFacebook(email);
      if (validEmail) {
        return userInDb;
      }
    }
    return null;
  },
  parseUserBeforeSending: (user) => {
    user.local = undefined;
    user.google = undefined;
    user.facebook = undefined;
    return user;
  },
};
