import axios from "axios";
import React, { Component } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../../userContext";
import "./settings.css";
function Settings() {
  const { logout, user } = useContext(UserContext);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  function handleNameChange() {
    const rgx = new RegExp(/[^a-zA-Z0-9]/);
    if (!rgx.test(name)) {
      axios
        .put(`${process.env.REACT_APP_API_URL}/auth/${user.username}`, {
          newUsername: name,
        })
        .then((res) => {
          navigate("/");
        })
        .catch((e) => console.log(e));
    }
  }
  return (
    <div className="settings-c">
      <div className="settings-field">
        <label htmlFor="name-change-input">Change Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder={user.username}
          id="name-change-input"
        />
        <button onClick={() => handleNameChange()} className="settings-button">
          Change Name!
        </button>
      </div>
      <button
        className="settings-button logout-settings"
        onClick={() => logout()}
      >
        Log out
      </button>
    </div>
  );
}

export default Settings;
