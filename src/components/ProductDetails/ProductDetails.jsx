import axios from "axios";
import React, { Component } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingPage from "../LoadingPage/LoadingPage";
import { AiOutlineUser, AiFillStar } from "react-icons/ai";
import { RiDeleteBack2Line } from "react-icons/ri";
import "./productDetails.css";

import { useContext } from "react";
import UserContext from "../../userContext";
import TextArea from "../utilities/TextArea/TextArea";
import Stars from "../utilities/Stars/Stars";

function ProductDetails() {
  const [detailsData, setDetailsData] = useState(null);
  const [error, setError] = useState(null);
  const { productId } = useParams();
  const { user, recent, handleSetRecent, setCart } = useContext(UserContext);
  const [reviewBody, setReviewBody] = useState("");
  const [reviewRating, setReviewRating] = useState(1);
  const [existingReview, setExistingReview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/product/${productId}`)
      .then((data) => {
        console.log(data);
        setDetailsData(data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [productId]);

  useEffect(() => {
    let existingReview = null;
    if (user) {
      detailsData?.reviews.forEach((review) => {
        if (review.user == user.username) {
          existingReview = review._id;
        }
      });
    }
    setExistingReview(existingReview);
  }, [user, detailsData]);

  useEffect(() => {
    if (user && recent) {
      console.log("SENDING ANYTHING");
      const items = [...recent]
        .map((el) => el._id)
        .filter((id) => id !== productId);
      items.unshift(productId);
      if (items.length > 15) {
        items.pop();
      }
      axios
        .put(`${process.env.REACT_APP_API_URL}/products/recent-product`, {
          items,
          username: user.username,
        })
        .then((res) => {
          console.log(res);
          const { recent } = res.data;
          handleSetRecent(recent);
        })
        .catch((e) => console.log(e));
    }
  }, [user]);

  function SubmitReview(e) {
    e.preventDefault();
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/products/product/review/${productId}`,
        {
          body: reviewBody,
          username: user?.username,
          rating: reviewRating,
        }
      )
      .then((res) => {
        window.location.href = window.location.href;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function DeleteReview(id) {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/products/reviews/${id}`)
      .then((res) => {
        window.location.href = window.location.href;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function AddToCart(id) {
    if (user && id) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/cart/${user.username}`, {
          productId: id,
        })
        .then((res) => {
          setCart(res.data.cart);
        })
        .catch((e) => console.log(e));
    }
  }
  console.log(productId);
  if (detailsData == null) return <LoadingPage />;
  return (
    <div className="product-details-page">
      <div className="product-details-body">
        <div className="product-details-img-c">
          <img
            className="product-details-img"
            src={detailsData?.product?.image}
            alt=""
          />
        </div>
        <div className="product-details-c">
          <h3 className="product-details-title">
            {detailsData?.product?.title}
          </h3>
          <a href="" className="rating-score-c"></a>
          <div className="product-details-desc-c">
            <div className="product-details-desc">
              {detailsData?.product?.description}
            </div>
            <button className="desc-more">Check the whole description</button>
          </div>
          <div className="add-cart-c">
            <div className="price-c">{detailsData?.product?.price} $</div>
            <button
              className="add-cart-btn"
              onClick={() => AddToCart(detailsData?.product?._id)}
            >
              Add to card
            </button>
          </div>
        </div>
      </div>

      <div className="reviews-c">
        <h2>User Reviews</h2>
        <Stars className={"xlg"} rating={detailsData?.product?.rating} />
        <ul className="reviews-list">
          {/* Add Review Form */}
          {user && existingReview === null && (
            <form className="review-form" onSubmit={(e) => SubmitReview(e)}>
              <div className="review-c">
                <div className="review-user-c">
                  <div className="review-user-profile">
                    <AiOutlineUser />
                  </div>
                  <div className="review-user-info">
                    <div className="rating">
                      {new Array(5).fill(0).map((x, index) => (
                        <button
                          className="review-stars-c"
                          type="button"
                          onClick={() => setReviewRating(index + 1)}
                        >
                          <AiFillStar
                            className={
                              index < reviewRating
                                ? "yellow review-star"
                                : "grey review-star"
                            }
                          />
                        </button>
                      ))}
                    </div>
                    <div className="review-username">{user?.username} </div>
                  </div>
                </div>
                <TextArea
                  placeholder="Review item ..."
                  className="mt2 w-100"
                  updateInput={(text) => setReviewBody(text)}
                />
                <button type="submit" className="add-review-btn">
                  Add Review
                </button>
              </div>
            </form>
          )}

          {detailsData?.reviews.map((review, index) => (
            <li key={index} className="review-c">
              <div className="review-user-c">
                <div className="review-user-profile">
                  <AiOutlineUser />
                </div>
                <div className="review-user-info">
                  <div className="rating">
                    {new Array(5).fill(0).map((x, index) => (
                      <div className="review-stars-c">
                        <AiFillStar
                          className={
                            index < review.rating
                              ? "yellow review-star"
                              : "grey review-star"
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className="review-username">
                    {review.user}
                    <span className="review-date">
                      {" "}
                      at {review.createdAt.slice(0, 10)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="review-desc">{review.body}</div>
              {review._id === existingReview && (
                <button
                  className="delete-review-btn"
                  onClick={() => DeleteReview(review._id)}
                >
                  <RiDeleteBack2Line className="delete-review-icon" />
                </button>
              )}
            </li>
          ))}
        </ul>
        {detailsData?.reviews.length == 0 && (
          <h3 className="no-reviews-heading">
            Looks like theres no reviews yet!
          </h3>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
