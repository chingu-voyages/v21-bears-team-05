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
    /*  Addin property on user object doesn't seems to work, so we send a new user  */
    const newUser = {
      uuid: user.uuid,
      method: user.method,
      avatar: user.avatar,
      name: user.name,
      bio: user.bio,
      cupboard: user.cupboard,
      ratings: user.ratings,
      recipeList: user.recipeList,
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
    delete data.local;
    delete data.facebook;
    delete data.google;
    return data;
  },

  parseUserDataForPublic: (user) => {
    const newUser = {
      uuid: user.uuid,
      avatar: user.avatar,
      name: user.name,
      bio: user.bio,
    };
    return newUser;
  },
};
