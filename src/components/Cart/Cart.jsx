import axios from "axios";
import React, { Component } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { RiGhostLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import UserContext from "../../userContext";
import "./cart.css";

function Cart() {
  const [activeCart, setActiveCart] = useState(false);
  const { user, cart, setCart } = useContext(UserContext);
  const [cartObj, setCartObj] = useState([]);

  function windowClick(event) {
    const path = event.path.filter((x) => {
      return x.className === "cart-list-c" || x.className === "cart-btn";
    });
    if (path.length < 1) {
      setActiveCart(false);
    }
  }

  useEffect(() => {
    window.addEventListener("mousedown", (e) => windowClick(e));
    return () => window.removeEventListener("mousedown", windowClick);
  }, []);

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
    <div className="cart-c">
      <button className="cart-btn" onClick={() => setActiveCart(!activeCart)}>
        <AiOutlineShoppingCart className="cart-icon" />
        {!activeCart && cartObj.length > 0 && (
          <div className="items-count-circle">{cartObj.length}</div>
        )}
      </button>

      {user && activeCart && (
        <div className="cart-list-c">
          {cartObj?.length > 0 && (
            <ul className="cart-list">
              <h3>Your cart: ({cartObj.length})</h3>
              {cartObj.map((item, index) => (
                <li key={index} className="item-c">
                  <Link
                    to={`${process.env.REACT_APP_PORT}/products/${
                      item.product._id
                    }/${item.product.title.replace(
                      new RegExp(/[\s\/]/, "gi"),
                      "-"
                    )}`}
                    className="item-img-c"
                  >
                    <img src={item.product.image} alt="product image" />
                  </Link>
                  <div className="item-info">
                    <Link
                      to={`${process.env.REACT_APP_PORT}/products/${
                        item.product._id
                      }/${item.product.title.replace(
                        new RegExp(/[\s\/]/, "gi"),
                        "-"
                      )}`}
                      className="item-title"
                    >
                      {item.product.title}
                    </Link>
                    <div className="item-ammount">ammount: {item.count}</div>
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
          )}
          {cartObj?.length === 0 && (
            <div className="cart-center-div">
              <RiGhostLine className="ghost-icon" />
            </div>
          )}

          <div className="cart-center-div">
            <Link
              className="checkout-link"
              to={`${process.env.REACT_APP_PORT}/account/my-account/cart`}
            >
              Checkout cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
