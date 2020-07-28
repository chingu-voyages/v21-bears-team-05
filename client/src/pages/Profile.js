import React, { useState } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import Editable from "../components/Editable";
import "./Profile.css";

const Profile = () => {
  const [userName, setUserName] = useState("Susan");
  const [avatar, setAvatar] = useState("https://d33wubrfki0l68.cloudfront.net/ec99b69e4512106ddf49a54a31a92853b19b2c6a/28b45/en/blog/uploads/web-developer-coding-backend.jpg")
  const [bio, setBio] = useState("I love my job as a coder but I forget to plan my meals and only have 2 eggs, 1 potato and some old mustard.  I hope this app will help me figure out what to have for dinner.")

  const updateUserName = (value) => {
    setUserName(value)
  }
  const updateBio = (value) => {
    setBio(value)
  }

  return (
    <Layout>
        <div className="profile">
            <div>
              <Editable tag="h1" handleSubmit={updateUserName}>
                {userName}
              </Editable>
              <img
                className="avatar"
                src={avatar}
                alt="profile pic"
              />
              <Editable tag="p" handleSubmit={updateBio} textarea>
                {bio}
              </Editable>
            </div>
        </div>
      <Link to="/publishrecipe">publish recipe</Link>
    </Layout>
  );
};

export default Profile;
