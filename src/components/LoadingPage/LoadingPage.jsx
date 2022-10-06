import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "./loadingPage.css";
function LoadingPage() {
  return (
    <div className="loading">
      <AiOutlineLoading3Quarters className="loading-icon" />
    </div>
  );
}

export default LoadingPage;
