import { addData, getData } from "./dataController.mjs";

const getActiveUserId = () => {
  let userID = JSON.parse(localStorage.getItem("user"))?.id;
  if (!userID) {
    userID = "guest";
  }
  return userID;
};

const updateUserData = async ({ data }) => {
  const currentUserData = await getUserData();
  await addData({
    destination: "users",
    data: data,
    oldData: currentUserData,
  });
  return true;
};

const getUserData = async ({ ref } = { ref: null }) => {
  let userData;
  if (ref) {
    userData = await getData({ destination: "users", ref });
  } else {
    const userID = getActiveUserId();
    if (!userID) {
      console.error("No userID! Somethings gone wrong");
    } else {
      userData = await getData({ destination: "users", ref: { id: userID } });
      if (!userData) {
        await newUser(userID);
        userData = await getData({ destination: "users", ref: { id: userID } });
      }
    }
  }
  return userData;
};

/*  Take a String as param  */
/*  Update name prop in users field */
const putName = async (name) => {
  const userID = getActiveUserId();
  return updateUserData({ data: { id: userID, name: name } });
};

/*  Take a String as param  */
/*  Update bio prop in users field */
const putBio = async (bio) => {
  const userID = getActiveUserId();
  return updateUserData({ data: { id: userID, bio: bio } });
};
/*  Take a String as param  */
/*  Update avatar prop in users field */
const putAvatar = async (avatarURL) => {
  const userID = getActiveUserId();
  return updateUserData({ data: { id: userID, avatar: avatarURL } });
};
const updateCupboard = async ({ ingredients }) => {
  const userID = getActiveUserId();
  await updateUserData({ data: { cupboard: ingredients, id: userID } });
  return true;
};

const getCupboard = async () => {
  const data = await getUserData();
  return data?.cupboard || [];
};

const newUser = async (userID) => {
  let currentData = {};
  if (userID !== "guest") {
    const guestData = await getUserData({ ref: { id: "guest" } });
    guestData && delete guestData.bio;
    currentData = guestData;
  }
  const id = await addData({ destination: "users", data: { ...currentData, id: userID } });
  return id;
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
