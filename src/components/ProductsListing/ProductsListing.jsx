import React, { Component } from "react";
import { Link, useLocation } from "react-router-dom";
import Stars from "../utilities/Stars/Stars";
import "./productsListing.css";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useContext } from "react";
import UserContext from "../../userContext";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
function ProductsListing({ data }) {
  const { user } = useContext(UserContext);
  const [favs, setFavs] = useState([]);
  const location = useLocation();

  const renderProducts = data?.map((product, index) => (
    <li key={index} className="product-c">
      <div className="product-img-c">
        <Link
          className="product-img-link"
          to={`/products/${product._id}/${product.title.replace(
            new RegExp(/[\s\/]/, "gi"),
            "-"
          )}`}
        >
          <img src={product.image} alt="" className="product-image" />
        </Link>
      </div>
      <div className="product-info">
        <Link
          to={`/products/${product._id}/${product.title.replace(
            new RegExp(/[\s\/]/, "gi"),
            "-"
          )}`}
          className="product-title"
        >
          {product.title.length > 100
            ? product.title.slice(0, 100) + "..."
            : product.title}
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
        {favs?.includes(product._id) === false ? (
          <AiOutlineHeart className="fav-icon" />
        ) : (
          <AiFillHeart className="fav-icon-active" />
        )}
      </button>
    </li>
  ));

  useEffect(() => {
    if (user) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/products/favs/get/${user.username}`
        )
        .then((res) => {
          const favourites = res.data.favourites.map((f) => f._id);
          setFavs(favourites);
        })
        .catch((e) => {});
    } else {
      setFavs([]);
    }
  }, [user]);

  function AddToFav(id) {
    if (user) {
      const favsArr = [...favs];
      const indx = favsArr.indexOf(id);
      console.log(indx);
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
            setFavs(favourites);
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
            console.log(res.data);
            setFavs((prev) => [...prev, id]);
          })
          .catch((e) => console.log(e));
      }
    }
  }

  return <ul className="products-list-c">{renderProducts}</ul>;
}

export default ProductsListing;
