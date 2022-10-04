import React, { Component } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './listingFilters.css';
import {IoIosArrowForward} from 'react-icons/io';
import {MdOutlineFilterList} from 'react-icons/md';
import {AiOutlineClose} from 'react-icons/ai';

function ListingFilters({productData=[],filterData,updateFilters}) {
    
    const [activeFilters,setActiveFilters] = useState(filterData)
    const [activeMenu,setActiveMenu] = useState(false)


    const [minPrice,setMinPrice] = useState(0);
    const [maxPrice,setMaxPrice] = useState(999999);
    const [minPriceInput,setMinPriceInput] = useState('');
    const [maxPriceInput,setMaxPriceInput] = useState('');

    const [innerWidth,setInnerWidth] = useState(window.innerWidth)
    
    function handleResize(e){
        setInnerWidth(e.target.innerWidth)
    }
    useEffect(()=>{
        window.addEventListener('resize',(e)=>handleResize(e))
        return ()=>window.removeEventListener('resize',handleResize)
    },[])

    useEffect(()=>{
        const data = filterData.map(f=>{
            const obj = {}
            f.values.forEach((v)=>{                     
                obj[v] = false
            })
            return Object.assign({...f},{values:obj})
        })
        setActiveFilters(data)
    },[])

    useEffect(()=>{
        if(productData.length>0){
            let min = 99999
            let sum = 0
            productData.forEach(el=>{
                if(min>el.price) min = el.price
                sum+=el.price
            })
            setMinPrice(Math.round(min))
            setMaxPrice(Math.round(sum/productData.length))
        }
    },[productData])


    function handleApplyFilters(){

        let min = 0
        let max = 99999.99

        const filters = [...activeFilters].map(f=>{
            const valuesArray = []
            for(let key in f.values){
                if(f.values[key]) valuesArray.push(key)
            }
            return Object.assign({...f},{values:valuesArray})
        })

        
        if(!validatePrice(minPriceInput) || !validatePrice(maxPriceInput)){
            setMinPriceInput(minPrice)
            setMaxPriceInput(maxPrice)
        }
        else if(parseFloat(minPriceInput) > parseFloat(maxPriceInput)){
            setMinPriceInput('')
            setMaxPriceInput('')
        }
        else{
            min = parseFloat(minPriceInput)
            max = parseFloat(maxPriceInput)
        }

        const filtersObject = {
            filters,
            priceRange:{
                minPrice:min,
                maxPrice:max
            }
        }
        updateFilters(filtersObject)

    }

    function handleCheckboxChange(checked,value,index){
        const filters = [...activeFilters]
        filters[index].values[value] = checked
        setActiveFilters(filters)
    }
    function handleRadioChange(checked,value,index){

        const filters = [...activeFilters]
        
        if(filters[index].values[value]){
            filters[index].values[value] = false
            setActiveFilters(filters)
        }
        else{
            for(let key in filters[index].values){
                filters[index].values[key] = false
            }
            filters[index].values[value] = true
            console.log('checked',checked)
            setActiveFilters(filters)
        }

    }
    return ( 
         
        <>
            <div className={innerWidth <= 1580?activeMenu?"mobile-filters":"hidden":""}>
                {innerWidth <= 900 && 
                <div className='nav-option-div'>
                    <button onClick={()=>setActiveMenu(false)} className='close-menu-btn'><AiOutlineClose className='close-icon'/></button>
                </div>}
                <ul className="filters-list">
                    {filterData?.map((filter,indx)=>
                        <li key={indx} className='filter-c'>{filter.filterName}
                            {filter.values.slice(0,10).map((v,index)=>
                                <div key={index} className="filter-option">
                                    <label htmlFor={`filter-${filter.filterName}-${v}`} className='filter-option-label' >
                                        {v}
                                    </label>
                                    {filter.isCheckbox && <input  id={`filter-${filter.filterName}-${v}`} className='checkbox-pop' type="checkbox" name={filter.filterName} onChange={(e)=>handleCheckboxChange(e.target.checked,v,indx)} />}
                                    {!filter.isCheckbox && <input checked={activeFilters[indx].values[v]} id={`filter-${filter.filterName}-${v}`} className='radiobox-pop' type="checkbox" value={v} name={filter.filterName} onClick={(e)=>handleRadioChange(e.target.checked,v,indx)} />}
                                    <span className={filter.isCheckbox?"checkbox-span":"radiobox-span"}></span>
                                </div>
                            )}
                        </li> 
                    )}
                </ul>
                
                <div className="price-filter-c">
                    <label htmlFor="price-filters">Price Range:</label>
                    <div className="price-filters" id='price-filters'>
                    <input placeholder={minPrice+" $"} type="text" className="price-low"  value={minPriceInput} onChange={(e)=>setMinPriceInput(e.target.value)}  />
                    <input placeholder={maxPrice+"+ $"} type="text" className="price-high" value={maxPriceInput} onChange={(e)=>setMaxPriceInput(e.target.value)}  />
                    <button className='price-submit-btn' onClick={()=>handleApplyFilters()}><IoIosArrowForward/></button>
                </div>

                </div>
                <button className='apply-filters-btn' onClick={()=>handleApplyFilters()}>Apply</button>
            </div>
            {innerWidth <= 1580 && 
            <button className='filters-btn'
            onClick={()=>setActiveMenu(!activeMenu)}>
                <MdOutlineFilterList/>
            </button>}
        </>

     );
}

const validatePrice = (price)=>{
    const lettersReg = new RegExp(/[a-zA-Z]/)
    
    if(lettersReg.test(price)) return false
    if(price < 0) return false
    return true

}

export default ListingFilters;