import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Layout from "../components/Layout";
import Editable from "../components/Editable";
import { StringMustNotBeEmpty } from "../utils/invalidators.mjs";
import PhotoUpload from "../components/PhotoUpload";
import {
  putName,
  putBio,
  putAvatar,
  getUserData,
  getActiveUserId,
} from "../services/users";
import Spinner from "../components/Spinner";
import { status, authModalToggle } from "../services/subscribers";
import RecipesList from "../components/RecipeList";
import Button from "../components/Button";
import PublishRecipe from "../components/PublishRecipe";
import "./Profile.css";
import AuthContext from "../hooks/AuthContext";

const Profile = () => {
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState();
  const [bio, setBio] = useState(
    "This is a guest account, please consider signing up or login to personalise your account and publish recipes."
  );
  const [recipes, setRecipes] = useState([]);
  const history = useHistory();

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
  const { dispatch } = React.useContext(AuthContext);

  useEffect(() => {
    (async () => {
      status.inProgress("Checking for user data");
      const userID = await getActiveUserId();
      userID && setUserID(userID);
      const userData = await getUserData();
      const { name, avatar, bio, recipes, uuid } = userData;
      status.clear();
      name && setUserName(name);
      avatar && setAvatar(avatar);
      bio && setBio(bio);
      recipes && setRecipes(recipes);
    })();
  }, []);

  const handleLogout = () => {
    console.log("logout clicked");
    dispatch({ type: "LOGOUT" });
    history.push("/");
  };

  return (
    <Layout>
      <div className="profilePage">
        <h1 className="profileTitle">Profile</h1>
        <div className="profile">
          {userName !== undefined ? (
            <div className="profilePage__info">
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
                <Button
                  className="profile__login-button"
                  onClick={() => authModalToggle.open()}
                >
                  Log in or Register
                </Button>
              )}
            </div>
          ) : (
            <Spinner />
          )}
          {userID != "guest" && (
            <Button className="profile__logout-button" onClick={handleLogout}>
              Log out
            </Button>
          )}
          <div className="profile__recipes-section">
            <h2>
              {userName &&
                (userName[userName.length - 1] === "s"
                  ? userName + "'"
                  : userName + "'s")}{" "}
              recipes
            </h2>
            {userID === "guest" && (
              <p>Sign up or login to publish your recipes</p>
            )}
            {recipes.length > 0 ? <RecipesList /> : <p>No recipes yet</p>}
          </div>
          <PublishRecipe />
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
