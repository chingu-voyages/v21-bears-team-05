import React from "react";
import "./ProfileEditor.css";

const ProfileEditor = ({ userData, toggle, handleChange }) => {
  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={toggle}>
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
        <label>
          bio:
          <textarea
            type="text"
            name="bio"
            value={userData.bio}
            onChange={handleChange}
          ></textarea>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default ProfileEditor;
