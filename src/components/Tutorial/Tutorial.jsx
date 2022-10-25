import React, { Component } from "react";
import "./tutorial.css";

function Tutorial({ setShowMsg }) {
  return (
    <div className="tutorial-whole-c">
      <div className="tutorial-c">
        <button className="show-btn" onClick={() => setShowMsg()}></button>
        <h2>Manual :</h2>
        <section>
          <h3>Attention!</h3>
          <ul>
            <li>Render.com takes ~30 seconds to startup the backend</li>
            <li>Please be patient!</li>
            <li>
              You will know its up and running when theres 4 categories in the
              center
            </li>
          </ul>
        </section>
        <section>
          <h3>Admin</h3>
          <ul>
            <li>You can login as an admin for extra functionality</li>
            <li>
              Username: <span>admin</span>
            </li>
            <li>
              Password: <span>admin123</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Tutorial;
