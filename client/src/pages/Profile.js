import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Editable from "../components/Editable";
import { StringMustNotBeEmpty } from "../utils/invalidators.mjs";
import PhotoUpload from "../components/PhotoUpload";
import { putName, putBio, putAvatar, getUserData } from "../services/users";
import Spinner from "../components/Spinner";
import { status, authModalToggle } from "../services/subscribers";
import defaultAvatar from "../images/defaultAvatar.svg";
import RecipesList from "../components/RecipeList";
import Button from "../components/Button";
import "./Profile.css";

const Profile = () => {
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [bio, setBio] = useState(
    "This is a guest account, please consider signing up or login to personalise your account and publish recipes."
  );
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
      const { name, avatar, bio, recipes, id } = userData;
      status.clear();
      name && setUserName(name);
      avatar && setAvatar(avatar);
      bio && setBio(bio);
      recipes && setRecipes(recipes);
      id && setUserID(id);
    })();
  }, []);

  return (
    <Layout>
      <div className="profile">
        {userName !== undefined ? (
          <div>
            <Editable
              key={userName}
              tag="h1"
              handleSubmit={updateUserName}
              validateFunc={userNameMustNotBeEmpty}
              placeholder="username"
            >
              {userName}
            </Editable>
            <PhotoUpload
              key={avatar}
              className="profile__avatar"
              src={avatar}
              alt="profile pic"
              setUploadUrl={updateAvatar}
              handleClick={userID === "guest" && authModalToggle.open}
            />
            <Editable
              key={bio}
              tag="p"
              handleSubmit={updateBio}
              handleClick={userID === "guest" && authModalToggle.open}
              placeholder="bio"
              textarea
            >
              {bio}
            </Editable>
            {userID === "guest" && (
              <Button onClick={() => authModalToggle.open()}>
                Login/Signup
              </Button>
            )}
          </div>
        ) : (
          <Spinner />
        )}

        <h2>
          {userName && (userName[userName.length - 1] === "s"
            ? userName + "'"
            : userName + "'s")}{" "}
          recipes
        </h2>
        {userID === "guest" && (
          <p>Sign up/login to publish your recipes</p>
        )}
        {recipes.length > 0 ? (
          <RecipesList />
        ) : (
          <p>No recipes yet</p>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
