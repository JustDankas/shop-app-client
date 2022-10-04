import axios from 'axios';
import React, { Component } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../../userContext';
import LoadingPage from '../../LoadingPage/LoadingPage';
import Carousel from '../../utilities/Carousel/Carousel';
import './profileMain.css';
import  {RiHeartAddFill} from 'react-icons/ri'
import ItemCarousel from '../../utilities/Carousel/ItemCarousel';
import Stars from '../../utilities/Stars/Stars';

function ProfileMain() {

    const {user,recent} = useContext(UserContext)
    const [favs,setFavs] = useState([])

    const [innerWidth,setInnerWidth] = useState(window.innerWidth)
    const [carouselItems,setCarouselItems] = useState(window.innerWidth<=700?1:window.innerWidth<=1080?2:3)
    function handleResize(e){
        setInnerWidth(e.target.innerWidth)
        if(e.target.innerWidth<=700){
            setCarouselItems(1)
        }
        else if(e.target.innerWidth<=1080){
            setCarouselItems(2)
        }
        else{
            setCarouselItems(3)
        }
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
    console.log('recent',recent)
    if(!user) return <LoadingPage/>
    return ( 
        <div className="profile-main">
            {recent && recent.length>0 && 
            <div className="profile-carousel">
                <h3>Recently viewed:</h3>
                <Carousel nOfItems={carouselItems}>
                    {recent?.map((product,index)=>(
                            <ItemCarousel nOfItems={carouselItems} key={index}>
                                <div className="carousel-product-c">
                                    <div className="carousel-product-img-c">
                                    <img src={product.image} alt="" className="carousel-product-image" />
                                    </div>
                                    <div className="carousel-product-info">
                                        <Link to={`/products/${product._id}/${product.title.replace(new RegExp(/[\s\/]/,'gi'),'-')}`} className="carousel-product-title">{product.title}</Link>
                                        <div className="carousel-product-rating">
                                            <Link to={`/products/${product._id}/${product.title.replace(new RegExp(/[\s\/]/,'gi'),'-')}`}>
                                                <Stars className='sm' rating={product.rating} />
                                            </Link>
                                            <span className='carousel-product-rating-count'>{`(${product.ratingCount})`}</span>
                                        </div>
                                        <div className="carousel-product-price"><span>from</span> {product.price} $</div>
                                    </div>
                                </div>
                            </ItemCarousel>
                        ))}
                </Carousel>
            </div>}
            {favs && 
            <div className="profile-carousel">
                <div className="carousel-headings">
                    <h3>Favourites:</h3>
                    {favs.length>0 && <Link className='more-link' to={'/account/my-account/favourites'} >Check all favourites</Link>}
                </div>
                {favs.length>0 && 
                <Carousel nOfItems={carouselItems}>
                    {favs?.map((product,index)=>(
                        <ItemCarousel nOfItems={carouselItems} key={index}>
                            <div className="carousel-product-c">
                                <div className="carousel-product-img-c">
                                <img src={product.image} alt="" className="carousel-product-image" />
                                </div>
                                <div className="carousel-product-info">
                                    <Link to={`/products/${product._id}/${product.title.replace(new RegExp(/[\s\/]/,'gi'),'-')}`} className="carousel-product-title">{product.title}</Link>
                                    <div className="carousel-product-rating">
                                        <Link to={`/products/${product._id}/${product.title.replace(new RegExp(/[\s\/]/,'gi'),'-')}`}>
                                            <Stars className='sm' rating={product.rating} />
                                        </Link>
                                        <span className='carousel-product-rating-count'>{`(${product.ratingCount})`}</span>
                                    </div>
                                    <div className="carousel-product-price"><span>from</span> {product.price} $</div>
                                </div>
                            </div>
                        </ItemCarousel>
                    ))}
                </Carousel>
                }
                {favs.length==0 && 
                <div className="center-div">
                    <RiHeartAddFill className='missing-favs-icon' />
                </div>
                }
            </div>}
        </div>
     );
}

export default ProfileMain;