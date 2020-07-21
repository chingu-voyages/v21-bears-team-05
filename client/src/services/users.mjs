import { addData, getData } from "./dataController.mjs";

const userID = "currentUserId"; // TODO get from auth

const updateUserData = async ({ data }) => {
  const currentUserData = await getUserData();
  await addData({ into: "users", data: { ...currentUserData, ...data } });
  return true;
};

const getUserData = async ({ ref } = { ref: null }) => {
  let userData;
  if (ref) {
    userData = getData({ from: "users", ref });
  } else {
    if (!userID) {
      console.error(`User not authorised`);
    } else {
      userData = getData({ from: "users", userID });
      if (!userData) {
        await newUser();
        userData = getData({ from: "users", userID });
      }
    }
  }
  return userData;
};

const updateCupboard = async ({ ingredients }) => {
  await updateUserData({ data: { cupboard: ingredients } });
  return true;
};

const getCupboard = async () => {
  const data = await getUserData();
  return data.cupboard || [];
};

const newUser = async () => {
  await addData({ into: "users", data: { id: userID } });
  return true;
};

export { updateCupboard, getCupboard, updateUserData, getUserData };
