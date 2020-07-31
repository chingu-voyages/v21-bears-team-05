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

const Profile = () => {
  const [userName, setUserName] = useState("Name");
  const [avatar, setAvatar] = useState(
    defaultAvatar
  );
  const [bio, setBio] = useState("Bio");

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
              className="avatar"
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
      </div>
      <Link to="/publishrecipe">publish recipe</Link>
    </Layout>
  );
};

export default Profile;
