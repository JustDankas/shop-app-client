import React, { Component } from 'react';
import { useState } from 'react';
import SelectBox from '../utilities/SelectBox/SelectBox';
function ProductForm({actionType}) {

    
    // const [actionType,setActionType] = useState('add')
    const [data,setData] = useState([]);
    const [categoryData,setCategoryData] = useState([]);
    
    const [productId,setProductId] = useState('')
    
    const [productTitle,setProductTitle] = useState('')
    const [productPrice,setProductPrice] = useState('')
    const [productImage,setProductImage] = useState('')
    const [productDesc,setProductDesc] = useState('')

    const [productFilters,setProductFilters] = useState([])
    const [currentProductCategory,setCurrentProductCategory] = useState([])


    function FetchData(){
        fetch('/admin').then(
            res=> res.json()
          ).then(
            data => {
                setData(data?.products)
                
            }
          )
        fetch('/admin/categories').then(
            res=> res.json()
          ).then(
            data => {
                setCategoryData(data)
                
            }
          )
    }

    function handleProductFormSubmit(e){
        e.preventDefault();
        const valuesArr = e.target;
        const productFiltersArray = [...productFilters].map((obj)=>{
            delete obj.isCheckbox
            delete obj._id
            const filterValues = []
            for(let key in obj.values){
                if(obj.values[key]==true) filterValues.push(key)
            }
            return Object.assign(obj,{values:filterValues})
          })
        const requestOptions = {
            method:actionType=='add'?"POST":"PUT",
            headers:{'Content-Type':"application/json"},
            body: JSON.stringify({ 
                title: valuesArr[0].value,
                price: parseFloat(valuesArr[1].value),
                image: valuesArr[2].value,
                description: valuesArr[3].value,
                categories: currentProductCategory.name,
                filters: productFiltersArray
          })
          }
          
          fetch(`/admin/product/${actionType=='add'?"new":`update/${productId}`}`,requestOptions).then(
            res=> res.json()
          ).then(
            data => {
                console.log(data)
                FetchData()
            }
          )

    }

    
    function handleUpdateProductCategory(category){
        fetch(`/category/${category}`).then(
            res=>res.json()
        ).then(
            data=>{
                const DATA = data.category[0];
                setCurrentProductCategory(DATA)
                const filters = data?.category[0].filters.map((f)=>{
                    const obj = {}
                    f.values.forEach((v)=>{                     
                        obj[v] = false
                    })
                    return Object.assign({...f},{values:obj})
                })
                setProductFilters(filters);
            }
        )
    }

    function handleProductFilterChange(e,value,row){
        console.log(e.target.checked,value,row)
        const productFiltersArray = [...productFilters]
        productFiltersArray[row].values[value] = e.target.checked
        setProductFilters(productFiltersArray)
        
    }

    return ( 
        <form className="action-form" onSubmit={(e)=>handleProductFormSubmit(e)}>
            <div className="field">
                <label htmlFor="title-admin-input" className="form-label">Product Title:
                </label>
                <textarea type="text" className="admin-input" id="title-admin-input" value={productTitle} onChange={(e)=>setProductTitle(e.target.value)} />
            </div>
            <div className="field">
                <label htmlFor="price-admin-input" className="form-label">Price:
                </label>
                <input type="text" className="admin-input" id="price-admin-input" value={productPrice} onChange={(e)=>setProductPrice(e.target.value)} />
            </div>
            <div className="field">
                <label htmlFor="image-admin-input" className="form-label">Image:
                </label>
                <input type="text" className="admin-input" id="image-admin-input" value={productImage} onChange={(e)=>setProductImage(e.target.value)} />
                
            </div>

            <div className="field">
                <label htmlFor="descr-admin-input" className="form-label">Description:
                </label>
                <textarea type="text" className="admin-input" id="descr-admin-input" value={productDesc} onChange={(e)=>setProductDesc(e.target.value)} />
                
            </div>

            <SelectBox optionsArray={categoryData?.categories} updateCategory={(category)=>handleUpdateProductCategory(category)} />
            <ul className='filters-list'>{currentProductCategory?.filters?.map((filter,index)=>{
                return <li key={index} className='filter-c'>{filter.filterName}
                            {filter.values.map((v)=>
                                <div className="filter-option">
                                <label htmlFor={`checkbox-${filter.filterName}-${v}`} >{v}</label>
                                {<input type="checkbox"
                                className='checkbox-pop' 
                                id={`checkbox-${filter.filterName}-${v}`}
                                checked={productFilters[index]?.values.hasOwnProperty(v)?
                                    productFilters[index]?.values[v]
                                    :false
                                } name={filter.filterName} onChange={(e)=>handleProductFilterChange(e,v,index)} />}
                                <span className="checkbox-span"></span>
                                </div>
                            )}
                        </li> 
                })}
            </ul>  
            <button type='submit'>{actionType=='add'?"Add":"Update"}</button>
        </form>
     );
}

export default ProductForm;