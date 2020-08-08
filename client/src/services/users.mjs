import { addData, getData } from "./dataController";
import { lookupIngredient } from "./ingredients";

const getActiveUserId = () => {
  let userID = JSON.parse(localStorage.getItem("user"))?.uuid;
  if (!userID) {
    userID = "guest";
    return userID;
  }
  console.log("users.getActiveUserId()", userID);
  return userID;
};

const updateUserData = async ({ data }) => {
  console.log("Users.updateUserData()", data);
  const currentUserData = await getUserData();
  await addData({
    destination: "users",
    ref: { uuid: getActiveUserId() },
    data: data,
    oldData: currentUserData,
  });
  return true;
};

const getUserData = async ({ ref } = { ref: null }) => {
  console.log("Users.getUserData()", ref);
  let userData;
  if (ref) {
    userData = await getData({ destination: "users", ref });
  } else {
    let userID = getActiveUserId();
    console.log("why no userID here?", userID);
    if (!userID) {
      console.error("No userID! Somethings gone wrong");
    } else {
      userData = await getData({ destination: "users", ref: { uuid: userID, route: 'active/' } });
      if (!userData) {
        await newUser(userID);
        userData = await getData({ destination: "users", ref: { uuid: userID, route: 'active/' } });
      }
    }
  }
  return userData;
};

/*  Take a String as param  */
/*  Update name prop in users field */
const putName = async (name) => {
  const userID = getActiveUserId();
  return updateUserData({ data: { uuid: userID, name: name } });
};

/*  Take a String as param  */
/*  Update bio prop in users field */
const putBio = async (bio) => {
  const userID = getActiveUserId();
  return updateUserData({ data: { uuid: userID, bio: bio } });
};
/*  Take a String as param  */
/*  Update avatar prop in users field */
const putAvatar = async (avatarURL) => {
  const userID = getActiveUserId();
  return updateUserData({ data: { uuid: userID, avatar: avatarURL } });
};
const updateCupboard = async ({ ingredients }) => {
  const userID = getActiveUserId();
  await updateUserData({
    data: {
      cupboard: ingredients.map((item) => (item?.uuid ? item.uuid : item)),
      uuid: userID,
    },
  });
  return true;
};

const getCupboard = async () => {
  const data = await getUserData();
  let cupboard = [];
  if (data?.cupboard) {
    for (let ref of data?.cupboard) {
      const ingredient = await lookupIngredient(ref);
      cupboard.push(ingredient);
    }
  }
  return cupboard;
};

const newUser = async (userID) => {
  let currentData = {};
  if (userID !== "guest") {
    const guestData = await getUserData({ ref: { uuid: "guest" } });
    guestData && delete guestData.bio;
    currentData = guestData;
  }
  const uuid = await addData({
    destination: "users",
    data: { ...currentData, uuid: userID },
    ref: { uuid: userID },
  });
  return uuid;
};

export {
  updateCupboard,
  getCupboard,
  updateUserData,
  getUserData,
  putName,
  putBio,
  putAvatar,
  getActiveUserId
};
