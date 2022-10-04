import React, { Component } from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import SearchBar from '../utilities/SearchBar/SearchBar';
import './home.css'
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../../userContext';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import Carousel from '../utilities/Carousel/Carousel';
import ItemCarousel from '../utilities/Carousel/ItemCarousel';
function Home() {

    const [categories,setCategories] = useState([])
    const [innerWidth,setInnerWidth] = useState(window.innerWidth)
    
    
    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API_URL}/admin/categories`)
        .then(res=>{
            setCategories(res.data.categories.slice(0,4))
        })
        .catch(e=>{
            console.log(e)
        })
    },[])

    function handleResize(e){
        setInnerWidth(e.target.innerWidth)
    }
    useEffect(()=>{
        window.addEventListener('resize',(e)=>handleResize(e))
        return ()=>window.removeEventListener('resize',handleResize)
    },[])

    return ( 
        <div className="home">
            {innerWidth>1080 && 
            <ul className="categories-c">
                {categories.map((cat,index)=>
                <li key={index} className="category-c">
                    <Link className='category-link' to={`/categories/${cat.name.toLowerCase()}`}>
                        <img className='category-image' src={cat.image} alt="category image" />
                        <div className="category-title">
                        {cat.name}
                        </div>
                    </Link>
                    
                </li>
                )}
                
            </ul>}

            {innerWidth<=1080 && 
            <div className="carousel-center-c">
                <Carousel nOfItems={innerWidth>600?2:1}>
                    {categories.map((cat,index)=>
                    <ItemCarousel key={index} nOfItems={innerWidth>600?2:1}>
                        <li key={index} className="carousel-category-c">
                            <Link className='category-link' to={`/categories/${cat.name.toLowerCase()}`}>
                                <img className='category-image' src={cat.image} alt="category image" />
                                <div className="category-title">
                                {cat.name}
                                </div>
                            </Link>
                        </li>
                    </ItemCarousel>
                    )}
                </Carousel>
            </div>
            }
            
        </div>
     );
}

export default Home;