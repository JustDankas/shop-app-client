import axios from "axios";
import React, { Component } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../../userContext";
import LoadingPage from "../../LoadingPage/LoadingPage";
import Stars from "../../utilities/Stars/Stars";
import "./favourites.css";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

function Favourites() {
  const { user } = useContext(UserContext);
  const [favs, setFavs] = useState(null);
  const [favsId, setFavsId] = useState(null);

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

  useEffect(() => {
    const favourites = favs?.map((f) => f._id);
    setFavsId(favourites);
  }, [favs]);

  function AddToFav(id) {
    if (user && favsId) {
      const favsArr = [...favsId];
      const indx = favsArr.indexOf(id);
      if (indx >= 0) {
        axios
          .put(
            `${process.env.REACT_APP_API_URL}/products/fav/remove/${user.username}`,
            {
              id,
            }
          )
          .then((res) => {
            const favourites = res.data.favourites.map((f) => f._id);
            setFavs(res.data.favourites);
            setFavsId(favourites);
          })
          .catch((e) => console.log(e));
      } else {
        axios
          .put(
            `${process.env.REACT_APP_API_URL}/products/fav/add/${user.username}`,
            {
              id,
            }
          )
          .then((res) => {
            setFavs((prev) => [...prev, id]);
          })
          .catch((e) => console.log(e));
      }
    }
  }
  if (!favs) return;
  return (
    <div className="favourites">
      {favs.length > 0 && (
        <ul className="favourites-list">
          {favs?.map((product, index) => (
            <li key={index} className="product-c">
              <div className="product-img-c">
                <img src={product.image} alt="" className="product-image" />
              </div>
              <div className="product-info">
                <Link
                  to={`/products/${product._id}/${product.title.replace(
                    new RegExp(/[\s\/]/, "gi"),
                    "-"
                  )}`}
                  className="product-title"
                >
                  {product.title}
                </Link>
                <div className="product-rating">
                  <Link
                    to={`/products/${product._id}/${product.title.replace(
                      new RegExp(/[\s\/]/, "gi"),
                      "-"
                    )}`}
                  >
                    <Stars rating={product.rating} />
                  </Link>
                  <span className="product-rating-count">{`(${product.ratingCount})`}</span>
                </div>
                <div className="product-price">
                  <span>from</span> {product.price} $
                </div>
              </div>

              <button className="fav-btn" onClick={() => AddToFav(product._id)}>
                {favsId?.includes(product._id) === false ? (
                  <AiOutlineHeart className="fav-icon" />
                ) : (
                  <AiFillHeart className="fav-icon-active" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
      {favs.length == 0 && (
        <h3 className="missing-favs-heading">
          Explore our products and add them to your wishlist! <AiFillHeart />
        </h3>
      )}
    </div>
  );
}

export default Favourites;
