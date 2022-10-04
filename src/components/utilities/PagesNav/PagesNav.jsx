import React, { Component } from 'react';
import './pagesNav.css';
import {GrFormPrevious,GrFormNext} from 'react-icons/gr'
function PagesNav({activePage,dataLength=5,updatePage}) {

    const pages = new Array(dataLength).fill(0);

    function nextPage(){
        if(activePage<dataLength-1){
            updatePage(activePage+1)
        }
    }
    function prevPage(){
        if(activePage>0){
            updatePage(activePage-1)
        }
    }

    function HandleChangePage(indx){
        updatePage(indx)
    }

    return ( 
    <div className="page-index-buttons">
        <button className="page-index-btn-prev" onClick={()=>prevPage()}>
            <div className="page-half-circle-left"></div>
            <GrFormPrevious />
        </button>
        {pages.map((page,index)=>{
            if(pages.length<5){
                return (            
                    <button 
                    key={index}
                    className={activePage==index?"page-index-btn page-active":"page-index-btn"}
                    onClick={()=>HandleChangePage(index)}>
                        {index+1}
                    </button>
                    )
            }
            else{
                if(activePage==index || index==activePage+1 || index==pages.length-1 || index==activePage-1 || index==0){
                    return (
                    <button 
                    key={index}
                    className={activePage==index?"page-index-btn page-active":"page-index-btn"}
                    onClick={()=>HandleChangePage(index)}>
                        {index+1}
                    </button>)
                }
            }
        })}
        <button className="page-index-btn-next" onClick={()=>nextPage()}>
        <div className="page-half-circle-right"></div>
            <GrFormNext />
        </button>
    </div>
     );
}

export default PagesNav;