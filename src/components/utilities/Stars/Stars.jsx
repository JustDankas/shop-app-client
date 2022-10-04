import React, { Component } from 'react';
import './stars.css';
import {AiFillStar} from 'react-icons/ai';
function Stars({className,rating}) {
    return ( 
        <div className="stars-c">
            <div className={"stars-outer "+className}>
                <AiFillStar className='star grey' />
                <AiFillStar className='star grey' />
                <AiFillStar className='star grey' />
                <AiFillStar className='star grey' />
                <AiFillStar className='star grey' />
                <div className={"stars-inner "+className} style={{width:Math.floor(rating*10+0.5)/10/5*100+'%'}}>
                    <AiFillStar/>
                    <AiFillStar/>
                    <AiFillStar/>
                    <AiFillStar/>
                    <AiFillStar/>
                </div>
            </div>

        </div>
     );
}

export default Stars;