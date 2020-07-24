import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { getUserData } from "../services/users";
import "./Profile.css";
import ProfileEditor from "../components/ProfileEditor";

const Profile = () => {
  const [editorVisible, setEditorVisible] = useState(false);
  const [userData, setUserData] = useState();

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

  useEffect(() => {
    getUserData().then(data => {
      setUserData(data)
    })
  }, [])

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
              <p>{userData.bio}</p>
            </div>
          )}
          <button onClick={toggleProfileEditor}>edit profile</button>
        </div>
      )}
      {editorVisible && (
        <ProfileEditor
          userData={userData}
          toggle={toggleProfileEditor}
          handleChange={handleChange}
        />
      )}
      <Link to="/publishrecipe">publish recipe</Link>
    </Layout>
  );
};

export default Profile;
