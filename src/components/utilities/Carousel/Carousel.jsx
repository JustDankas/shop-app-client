import React, { Component, useEffect } from 'react';
import './carousel.css';
import {AiOutlineArrowRight,AiOutlineArrowLeft} from 'react-icons/ai';
import { useState } from 'react';
function Carousel({nOfItems=5,children}) {

    
    const [currentSlide,setCurrentSlide] = useState(0);
    const dataLength = children?.length
    // const [nOfItems,setnOfItems] = useState(3)
    const [canClick,setCanClick] = useState(true)


    // If window size changes , we reset carousel
    useEffect(()=>{
        setCurrentSlide(0)
    },[nOfItems])

    //  Makes user unable to rotate carousel every ms , instead he can rotate every 750ms
    useEffect(()=>{
        const timeout = setTimeout(() => {
            setCanClick(true)
        }, 750);
        return ()=>clearTimeout(timeout)
    },[canClick])

    function HandleNextSlide(){
        if(dataLength<nOfItems) return;
        if(!canClick) return;
        const extras = dataLength%nOfItems
        setCurrentSlide((prev)=>{
            if(extras>0){
                if(prev+nOfItems+extras==dataLength) return prev+extras
            }
            if(prev+nOfItems==dataLength) return prev

            return prev+nOfItems
        })
        setCanClick(false);
    }
    function HandlePreviousSlide(){
        if(dataLength<nOfItems) return
        if(!canClick) return;
        const extras = dataLength%nOfItems
        setCurrentSlide((prev)=>{
            if(extras >0){
                if(prev+nOfItems==dataLength) return prev-extras
            }
            if(prev===0) return prev
            return prev-nOfItems
        });
        setCanClick(false);
    }

    function handleTouchStart(event){
        console.log(event)
    }
    function handleTouchEnd(event){
        console.log(event)
    }

    console.log(currentSlide,nOfItems)
    if(children==null) return
    return ( 
        <div className="carousel-c">
            
            {dataLength>(nOfItems+currentSlide) && 
            <button className="left-arrow" onClick={()=>HandleNextSlide()}>{<AiOutlineArrowRight/>}</button>}
            <div className="carousel">
                <div className="inner" style={{transform:`translateX(-${currentSlide*(100/nOfItems)}%)`}}
                onTouchStart={(e)=>handleTouchStart(e)}
                onTouchEnd={(e)=>handleTouchEnd(e)}
                >
                    {children}
                </div>
            </div>

            {currentSlide!==0 && <button className="right-arrow" onClick={()=>HandlePreviousSlide()}>{<AiOutlineArrowLeft/>}</button>}
        </div>
     );
}

export default Carousel;