import axios from "axios";
import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import {
  Link,
  Navigate,
  Route,
  Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import UserContext from "../../../userContext";
import Carousel from "../../utilities/Carousel/Carousel";
import ProfileHeader from "../ProfileHeader/ProfileHeader";
import { CgUser } from "react-icons/cg";
import { BsGear } from "react-icons/bs";
import { AiOutlineHeart, AiOutlineStar } from "react-icons/ai";
import "./myAccount.css";
import ProfileMain from "../ProfileMain/ProfileMain";
import Favourites from "../Favourites/Favourites";
import Reviews from "../Reviews/Reviews";
import Settings from "../Settings/Settings";
import MyCart from "../MyCart/MyCart";

function MyAccount() {
  const { user } = useContext(UserContext);
  const [favs, setFavs] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  function handleResize(e) {
    setInnerWidth(e.target.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", (e) => handleResize(e));
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (user) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/products/favs/get/${user.username}`
        )
        .then((res) => {
          setFavs(res.data.favourites);
        })
        .catch((e) => console.log(e));
    }
  }, [user]);

  function handleNav(path) {
    navigate(`/account/my-account${path}`);
  }

  return (
    <>
      <ProfileHeader />
      <div className="my-account">
        <div className="my-account-c">
          {innerWidth > 1080 && (
            <nav className="profile-nav">
              <div className="nav-option">
                <CgUser className="profile-nav-icon" />
                <button
                  className={
                    location.pathname.split("/")[3] === undefined ||
                    location.pathname.split("/")[3] === ""
                      ? "nav-btn nav-active"
                      : "nav-btn"
                  }
                  onClick={() => handleNav("")}
                >
                  My Account
                </button>
              </div>
              <div className="nav-option">
                <AiOutlineHeart className="profile-nav-icon" />
                <button
                  className={
                    location.pathname.split("/")[3] === "favourites"
                      ? "nav-btn nav-active"
                      : "nav-btn"
                  }
                  onClick={() => handleNav("/favourites")}
                >
                  Favourites
                </button>
              </div>
              <div className="nav-option">
                <AiOutlineStar className="profile-nav-icon" />
                <button
                  className={
                    location.pathname.split("/")[3] === "reviews"
                      ? "nav-btn nav-active"
                      : "nav-btn"
                  }
                  onClick={() => handleNav("/reviews")}
                >
                  Reviews
                </button>
              </div>
              <div className="nav-option">
                <BsGear className="profile-nav-icon" />
                <button
                  className={
                    location.pathname.split("/")[3] === "settings"
                      ? "nav-btn nav-active"
                      : "nav-btn"
                  }
                  onClick={() => handleNav("/settings")}
                >
                  Settings
                </button>
              </div>
            </nav>
          )}
          <div className="profile-body">
            <Routes>
              <Route path="/" element={<ProfileMain />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/cart" element={<MyCart />} />
              <Route path="/*" element={<Navigate to={"/not-found"} />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyAccount;
