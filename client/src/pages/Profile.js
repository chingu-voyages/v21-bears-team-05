import React, { useState } from "react";
import Layout from "../components/Layout";
import "./Profile.css";

const Profile = () => {
  const userData = {
    username: "Susan",
    avatar:
      "https://d33wubrfki0l68.cloudfront.net/ec99b69e4512106ddf49a54a31a92853b19b2c6a/28b45/en/blog/uploads/web-developer-coding-backend.jpg",
    bio:
      "I love my job as a coder but I forget to plan my meals and only have 2 eggs, 1 potato and some old mustard.  I hope this app will help me figure out what to have for dinner.",
  };

  return (
    <Layout>
      <div className="profile">
        {userData && (
          <div>
            <h1>{userData.username}</h1>
            <img
              className="avatar"
              src={userData.avatar}
              alt="profile pic"
            ></img>
            <p>{userData.bio}</p>
          </div>
        )}
      </div>
      <button>edit profile</button>
      {/* edit button which launches form display? */}
    </Layout>
  );
};

export default Profile;
