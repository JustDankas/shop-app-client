import axios from 'axios';
import React, { Component } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import './searchPage.css';


function SearchPage() {
    const [searchParams,setSearchParams] = useSearchParams()
    const [categories,setCategories] = useState(null)
    const [products,setProducts] = useState()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(()=>{
        const searchTerm = searchParams.get('keyphrase')
        if(searchTerm){
            axios.post(`${process.env.API_URL}/products/search/${searchTerm}`,{})
            .then(res=>{
                const categoryData = res.data.categories
                const productsData = res.data.products

                if(categoryData){
                    if(categoryData.length==1){
                        navigate(`/categories/${categoryData[0].name}`)
                    }
                    else{
                        console.log(categoryData)
                        setCategories(categoryData)
                    }
                }
                else if(productsData){
                    const catObj = {}
                    const maxCat = {category:'',count:0}
                    productsData.forEach(el=>{
                        const {categories} = el
                        console.log(el)
                        if(categories in catObj){
                            catObj[categories]+=1
                        }
                        else{
                            catObj[categories]=1
                        }
                        if(catObj[categories]>maxCat.count){
                            maxCat.count = catObj[categories]
                            maxCat.category = categories
                        }
                    })
                    if(maxCat.category!==''){
                        navigate(`/categories/${maxCat.category}`)
                    }else{
                        navigate('/nothing')
                    }
                    
                }
            })
            .catch(e=>navigate('/nothing'))
        }
        
    },[searchParams,location])

    return ( 
        <div className="search-page">
            {categories && <div className="search-categories">
                <h2>Search results for <b>{searchParams.get('keyphrase')}</b></h2>
                <ul className="search-categories-list">
                    
                    {categories.map(c=>(
                        <li className='search-category-c'>
                            <Link to={`/categories/${c.name}`}><img src={c.image} alt="" /></Link>
                            <Link to={`/categories/${c.name}`}><h4>{c.name[0].toUpperCase()+c.name.slice(1)}</h4></Link>
                        </li>
                    ))}
                </ul>
            </div>}

        </div>
     );
}

export default SearchPage;