import React, { Component, useContext, useEffect } from 'react';
import UserContext from '../../../userContext';
import LoadingPage from '../../LoadingPage/LoadingPage';
import './profileHeader.css'
import {AiOutlineUser,AiOutlineStar,AiOutlineHeart} from 'react-icons/ai'
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function ProfileHeader() {

    const {user} = useContext(UserContext)

    const [reveiws,setReviews] = useState([])

    const [favs,setFavs] = useState([])

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
            axios.get(`${process.env.REACT_APP_API_URL}/products/favs/get/${user.username}`)
            .then(res=>{ 
                setFavs(res.data.favourites)
            })
            .catch(e=>console.log(e))
        }

    },[user])

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

    if(!user) return <LoadingPage/>
    return ( 
        <div className="profile-header">
            <div className="profile-info-c">
                <div className="profile-pic">
                    <AiOutlineUser className="profile-icon"/>
                </div>
                <div className="profile-info">
                    <span>Welcome,</span>
                    <div className="profile-name">{user.username}</div>
                </div>
            </div>
            {innerWidth > 600 && 
            <div className="profile-meta-c">
                <div className="profile-meta">
                    <Link to={'/account/my-account/favourites'}>
                        <AiOutlineHeart className='meta-icon meta-fav'/>
                        <div className="meta-title">Favourites</div>
                    </Link>
                    {favs.length}
                </div>
                <div className="profile-meta">
                    <Link to={'/account/my-account/reviews'}>
                        <AiOutlineStar className='meta-icon meta-review'/>
                        <div className="meta-title">Reviews</div>
                    </Link>

                    {reveiws.length}
                </div>
            </div>}
        </div>
     );
}

export default ProfileHeader;