import axios from 'axios';
import React, { Component } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import UserContext from '../../../userContext';
import LoadingPage from '../../LoadingPage/LoadingPage';
import {RiDeleteBack2Line} from 'react-icons/ri'
import {AiOutlineUser,AiFillStar} from 'react-icons/ai'
import { Link } from 'react-router-dom';
import './reviews.css';
import {TiPencil} from 'react-icons/ti'

function Reviews() {

    const {user} = useContext(UserContext)
    const [reveiws,setReviews] = useState([])

    const [innerWidth,setInnerWidth] = useState(window.innerWidth)

    function handleResize(e){
        setInnerWidth(e.target.innerWidth)
    }
    useEffect(()=>{
        window.addEventListener('resize',(e)=>handleResize(e))
        return ()=>window.removeEventListener('resize',handleResize)
    },[])

    useEffect(()=>{
        if(user){
            axios.get(`${process.env.REACT_APP_API_URL}/products/reviews/user/${user.username}`)
            .then(res=>{
                setReviews(res.data.reviews)
            })
            .catch(e=>{
                console.log(e)
            })
        }
    },[])
    console.log(reveiws)
    if(!user) return <LoadingPage/>
    return ( 
        <div className="reviews">
            {reveiws?.length>0 && <ul className="reviews-list">
                {reveiws?.map((review,indx)=>(
                    <li key={indx} className="review-c">

                            <div className="review-user-c">
                                <div className="review-product-img-c">
                                    <img src={review.productId.image} alt={review.productId.title} />
                                </div>
                                <div className="review-user-info">
                                    <Link to={`/products/${review.productId._id}/${review.productId.title.replace(new RegExp(/[\s\/]/,'gi'),'-')}`} className="review-product-title">
                                        {innerWidth>600?review.productId.title:review.productId.title.slice(0,40)+'...'}
                                    </Link>
                                    <div className="rating">
                                        {new Array(5).fill(0).map((x,index)=>(
                                            <div key={index} className='review-stars-c'>
                                                <AiFillStar className={index<review.rating?"yellow review-star":"grey review-star"} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="review-username">{review.user.username} 
                                    <span className="review-date"> at  {review.createdAt.slice(0,10)}</span></div>
                                </div>
                            </div>
                            <div className="review-desc">{review.body}</div>

                    </li>
                ))}
            </ul>}
            {reveiws?.length===0 && <div className="missing-reviews-c">
                <h2>No reviews to be found!</h2>
                <TiPencil className='missing-reviews-icon'/>
            </div>}

        </div>
     );
}

export default Reviews;