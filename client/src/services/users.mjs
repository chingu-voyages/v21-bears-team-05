import { addData, getData } from './dataController.mjs';

let userID = null;

/*  Return User ID from localStorage  */
const getTokenFromLocalStorage = () => {
  try {
    const parsedUser = JSON.parse(localStorage.getItem('user'));
    return parsedUser.id;
  } catch (error) {}
};

const updateUserData = async ({ data }) => {
  const currentUserData = await getUserData();
  await addData({
    destination: 'users',
    data: { ...currentUserData, ...data },
  });
  return true;
};

const getUserData = async ({ ref } = { ref: null }) => {
  userID = getTokenFromLocalStorage();
  let userData;
  if (ref) {
    userData = await getData({ destination: 'users', ref });
  } else {
    if (!userID) {
      console.error(`User not authorised`);
    } else {
      userData = await getData({ destination: 'users', ref: { id: userID } });
      if (!userData) {
        await newUser();
        userData = await getData({ destination: 'users', ref: { id: userID } });
      }
    }
  }

  return userData;
};

/*  Take a String as param  */
/*  Update name prop in users field */
const putName = async (name) => {
  return updateUserData({ data: { id: userID, name: name } });
};

/*  Take a String as param  */
/*  Update bio prop in users field */
const putBio = async (bio) => {
  return updateUserData({ data: { id: userID, bio: bio } });
};
/*  Take a String as param  */
/*  Update avatar prop in users field */
const putAvatar = async (avatarURL) => {
  return updateUserData({ data: { id: userID, avatar: avatarURL } });
};
const updateCupboard = async ({ ingredients }) => {
  await updateUserData({ data: { cupboard: ingredients, id: userID } });
  return true;
};

const getCupboard = async () => {
  const data = await getUserData();
  return data?.cupboard || [];
};

const newUser = async () => {
  await addData({ destination: 'users', data: { id: userID } });
  return true;
};

export {
  updateCupboard,
  getCupboard,
  updateUserData,
  getUserData,
  putName,
  putBio,
  putAvatar,
};
