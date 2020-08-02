import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import Editable from "../components/Editable";
import { StringMustNotBeEmpty } from "../utils/invalidators.mjs";
import PhotoUpload from "../components/PhotoUpload";
import { putName, putBio, putAvatar, getUserData } from "../services/users";
import Spinner from "../components/Spinner";
import { status } from "../services/subscribers";
import defaultAvatar from "../images/defaultAvatar.svg";
import "./Profile.css";
import RecipesList from "../components/RecipeList";

const Profile = () => {
  const [userName, setUserName] = useState("Guest");
  const [avatar, setAvatar] = useState(
    defaultAvatar
  );
  const [bio, setBio] = useState("This is a guest acocunt, please consider signing up or login to personailise your account and publish recipes.");
  const [recipes, setRecipes] = useState([]);

  const updateUserName = async (value) => {
    await putName(value);
    setUserName(value);
  };
  const updateBio = async (value) => {
    await putBio(value);
    setBio(value);
  };
  const updateAvatar = async (url) => {
    await putAvatar(url);
    setAvatar(url);
  };
  const userNameMustNotBeEmpty = new StringMustNotBeEmpty("User Name");

  useEffect(() => {
    (async () => {
      status.inProgress("Checking for user data");
      const userData = await getUserData();
      const { name, avatar, bio } = userData;
      status.clear();
      name && setUserName(name);
      avatar && setAvatar(avatar);
      bio && setBio(bio);
    })();
  }, []);

  return (
    <Layout>
      <div className="profile">
        {userName !== undefined ? (
          <div>
            <Editable
              tag="h1"
              handleSubmit={updateUserName}
              validateFunc={userNameMustNotBeEmpty}
            >
              {userName}
            </Editable>
            <PhotoUpload
              key={avatar}
              className="profile__avatar"
              src={avatar}
              alt="profile pic"
              setUploadUrl={updateAvatar}
            />
            <Editable tag="p" handleSubmit={updateBio} textarea>
              {bio}
            </Editable>
          </div>
        ) : (
          <Spinner />
        )}

        <h2>{userName[userName.length-1] === "s" ? userName+"'" : userName+"'s"} published recipes</h2>
          {recipes.length > 0 ? <RecipesList /> : <p>No recipes published yet</p>}
      </div>
    </Layout>
  );
};

export default Profile;
