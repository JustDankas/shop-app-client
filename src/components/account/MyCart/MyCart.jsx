import React, { Component } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../../userContext";
import "./myCart.css";
import { FaTrashAlt } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import axios from "axios";

function MyCart() {
  const { user, cart, setCart } = useContext(UserContext);
  const [cartObj, setCartObj] = useState([]);

  useEffect(() => {
    if (user && cart) {
      const obj = {};
      const cartArr = [...cart];
      cartArr.forEach((item) => {
        const { _id } = item;
        if (_id in obj) {
          obj[_id].count += 1;
        } else {
          obj[_id] = {
            product: item,
            count: 1,
          };
        }
      });
      const cartObjs = [];
      for (let key in obj) {
        cartObjs.push(obj[key]);
      }
      setCartObj(cartObjs);
    }
  }, [user, cart]);

  function RemoveFromCart(id) {
    if (id && user) {
      axios
        .put(`${process.env.REACT_APP_API_URL}/cart/${user.username}`, {
          productId: id,
        })
        .then((res) => {
          setCart(res.data.cart);
        })
        .catch((e) => console.log(e));
    }
  }

  if (!user) return;
  return (
    <div className="my-cart">
      <ul className="my-cart-list">
        {cartObj.map((item) => (
          <li className="my-cart-item-c">
            <Link
              to={`/products/${item.product._id}/${item.product.title.replace(
                new RegExp(/[\s\/]/, "gi"),
                "-"
              )}`}
              className="my-cart-item-img-c"
            >
              <img src={item.product.image} alt="product-image" />
            </Link>

            <div className="product-responsive">
              <Link
                to={`/products/${item.product._id}/${item.product.title.replace(
                  new RegExp(/[\s\/]/, "gi"),
                  "-"
                )}`}
                className="my-cart-item-title"
              >
                {item.product.title}
              </Link>
              <div className="product-price-info">
                <div className="my-cart-item-count">{item.count}</div>
                <div className="my-cart-item-price">{item.product.price}$</div>
              </div>
            </div>
            <button
              className="cart-remove-btn"
              onClick={() => RemoveFromCart(item.product._id)}
            >
              <FaTrashAlt />
            </button>
          </li>
        ))}
      </ul>
      {cart.length > 0 && (
        <div className="total-price">
          Total:{" "}
          {cartObj.reduce((sum, item) => {
            return sum + item.product.price;
          }, 0)}{" "}
          $
        </div>
      )}
      {cart.length == 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "2.5rem",
          }}
        >
          Cart is empty! <AiOutlineShoppingCart />
        </div>
      )}
    </div>
  );
}

export default MyCart;
