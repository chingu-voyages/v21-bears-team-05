import React, { useState } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import "./Profile.css";


const Profile = () => {
  const user = {
    username: "Susan",
    avatar:
      "https://d33wubrfki0l68.cloudfront.net/ec99b69e4512106ddf49a54a31a92853b19b2c6a/28b45/en/blog/uploads/web-developer-coding-backend.jpg",
  };

  const [editorVisible, setEditorVisible] = useState(false);
  const [userData, setUserData] = useState(user);

  const toggleProfileEditor = () => {
    setEditorVisible(!editorVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Layout>
      {!editorVisible && (
        <div className="profile">
          {userData && (
            <div>
              <h1>{userData.username}</h1>
              <img
                className="avatar"
                src={userData.avatar}
                alt="profile pic"
              ></img>
            </div>
          )}
          <button onClick={toggleProfileEditor}>edit profile</button>
        </div>
      )}
      {editorVisible && (
        <div>
          <h1>Edit Profile</h1>
          <form onSubmit={toggleProfileEditor}>
            <label>
              username:
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleChange}
              ></input>
            </label>
            <label>
              avatar:
              <input
                type="text"
                name="avatar"
                value={userData.avatar}
                onChange={handleChange}
              ></input>
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      )}
      <Link to="/publishrecipe">publish recipe</Link>
    </Layout>
  );
};

export default Profile;
