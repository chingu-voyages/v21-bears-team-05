import { addData, getData } from "./dataController.mjs";

const userID = "currentUserId"; // TODO get from auth

const updateUserData = async ({ data }) => {
  const currentUserData = await getUserData();
  await addData({ destination: "users", data: { ...currentUserData, ...data } });
  return true;
};

const getUserData = async ({ ref } = { ref: null }) => {
  let userData;
  if (ref) {
    userData = await getData({ destination: "users", ref });
  } else {
    if (!userID) {
      console.error(`User not authorised`);
    } else {
      userData = await getData({ destination: "users", ref: { id: userID } });
      if (!userData) {
        await newUser();
        userData = await getData({ destination: "users", ref: { id: userID } });
      }
    }
  }
  
  return userData;
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
  await addData({ destination: "users", data: { id: userID } });
  return true;
};

export { updateCupboard, getCupboard, updateUserData, getUserData };
