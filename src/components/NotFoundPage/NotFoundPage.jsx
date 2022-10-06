import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./notFoundPage.css";
function NotFoundPage() {
  return (
    <div className="not-found-p">
      <h2>Oh oh!</h2>
      <h2 className="e404">#404</h2>
      <h2>Page Not Found!</h2>
      <Link to={`${process.env.REACT_APP_PORT}/`}>Get me back to safety</Link>
    </div>
  );
}

export default NotFoundPage;
