import React, { Component, useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import ListingFilters from '../ListingFilters/ListingFilters';
import LoadingPage from '../LoadingPage/LoadingPage';
import ProductsListing from '../ProductsListing/ProductsListing';
import PagesNav from '../utilities/PagesNav/PagesNav';
import {IoMdArrowDropdown} from 'react-icons/io';
import './categoryPage.css'

const productsPerPage = 24

function CategoryPage({isLogged}) {


    const [data,setData] = useState([]);
    const [categoryData,setCategoryData] = useState([]);
    const {catName} = useParams();
    const [sortBy,setSortBy] = useState('popularity')
    const [activeFilters,setActiveFilters] = useState(null)
    
    const [activePage,setActivePage] = useState(0)
    const [active,setActive] = useState(false)

    const [innerWidth,setInnerWidth] = useState(window.innerWidth)
    
    function handleResize(e){
        setInnerWidth(e.target.innerWidth)
    }
    useEffect(()=>{
        window.addEventListener('resize',(e)=>handleResize(e))
        return ()=>window.removeEventListener('resize',handleResize)
    },[])
    
    useEffect(()=>{
        fetch(`${process.env.API_URL}/products/${catName.toLowerCase()}?sortBy=${sortBy}`).then(
            res=>res.json()
        ).then(
            data=>{
                let DATA = data?.products;
                if(activeFilters!=null){
                    const d = DATA.filter((item)=>{
                        let valid = true;
                        if(item.price < activeFilters.priceRange.minPrice ||
                             item.price > activeFilters.priceRange.maxPrice) return false
                        activeFilters.filters.forEach((f,index)=>{
                            let found = false
                            for(let v in item.filters[index].values){
                                if(f.values.includes(item.filters[index].values[v])){
                                    found = true
                                    break
                                }
                            }
                            if(!found && f.values.length > 0) valid = false
                        })
                        return valid
                    })
                    setData(d)
                }
                else{
                    setData(DATA)
                }
                
            }
        )
    },[sortBy,activeFilters])

    useEffect(()=>{
        fetch(`${process.env.API_URL}/category/${catName.toLowerCase()}`).then(
            res=>res.json()
        ).then(
            data=>{
                setCategoryData(data)
            }
        )
    },[])

    function handleSortBy(v){
        setSortBy(v)
        setActive(false)
    }

    if(categoryData.length < 1) return <LoadingPage/>
    return ( 
        <div className="category-page-c">
            <div className="category-body-c">
                <div className="filters-c">
                    <ListingFilters productData={data} filterData={categoryData.category[0]?.filters} updateFilters={(filters)=>setActiveFilters(filters)} />
                </div>
                <div className="category-products-c">
                    <div className="row">
                        {/* <select name="sort-by" id="sort-by" 
                        className="select-c"
                        onChange={(e)=>setSortBy(e.target.value)}
                        >
                            <option className='sort-option' value="popularity">Popularity</option>
                            <option className='sort-option' value="highest">Highest Price</option>
                            <option className='sort-option' value="lowest">Lowest Price</option>
                            <option className='sort-option' value="rating">Rating</option>
                        </select> */}
                        <div className="sort-select-box-c">
                            {!active && 
                                <button onClick={()=>setActive(!active)} className="sort-choice-c">
                                    <input type="radio" className='sort-radio' id={sortBy} name='sort-by' />
                                    <label className='sort-label' htmlFor={sortBy}>{sortBy}</label>
                                    <IoMdArrowDropdown className='sortbox-icon'/>
                                </button>
                            }
                            {active && 
                            <div className="sort-options-list">
                                    <button className="sort-option-btn" onClick={()=>setActive(!active)}>
                                        <input type="radio" className='sort-radio' id={sortBy} name='sort-by' />
                                        <label className='sort-label' htmlFor={sortBy}>{sortBy}</label>
                                        <IoMdArrowDropdown className='sortbox-icon'/>
                                    </button>
                                {['popularity','highest','lowest','rating'].map((x,index)=>(
                                    x!==sortBy && <button key={index} className="sort-option-btn" onClick={()=>handleSortBy(x)}>
                                        <input type="radio" className='sort-radio' id={x} name='sort-by' />
                                        <label className='sort-label' htmlFor={x}>{x}</label>
                                    </button>
                                ))}
                            </div>}
                        </div>
                        <PagesNav 
                        dataLength={Math.ceil(data?.length/productsPerPage)}
                        // dataLength={5}
                        activePage={activePage} 
                        updatePage={(page)=>setActivePage(page)} />
                    </div>
                    
                    <ProductsListing data={data.slice(activePage*productsPerPage,(activePage+1)*productsPerPage)}/>
                    
                </div>
            </div>
        </div>
     );
}

export default CategoryPage;