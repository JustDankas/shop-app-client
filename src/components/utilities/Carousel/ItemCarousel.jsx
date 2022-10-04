import React, { Component } from 'react';
function ItemCarousel({nOfItems,children}) {
    
    return ( 
        <div  className={`carousel-item items-c-${nOfItems}`}>
            {children}
        </div>
     );
}

export default ItemCarousel;