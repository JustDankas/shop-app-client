import React, { Component } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import PagesNav from '../utilities/PagesNav/PagesNav';
import ResizableInput from '../utilities/ResizableInput/ResizableInput';
import SelectBox from '../utilities/SelectBox/SelectBox';
import TextArea from '../utilities/TextArea/TextArea';
import './admin.css';
import {MdOutlineLibraryAdd,MdSystemUpdateAlt,MdOutlineAdd} from 'react-icons/md';
import {RiDeleteBin7Line} from 'react-icons/ri';
import {AiFillDelete} from 'react-icons/ai';
import { useContext } from 'react';
import UserContext from '../../userContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import LoadingPage from '../LoadingPage/LoadingPage';
import axios from 'axios';
// const nPages = 3
function Admin() {

    const [popup,setPopup] = useState(null)
    const [errorPopup,setErrorPopup] = useState(null)
    const [search,setSearch] = useSearchParams({item:''})

    const [actionType,setActionType] = useState('add')
    const [activePage,setActivePage] = useState(0)
    const [data,setData] = useState([]);
    const [categoryData,setCategoryData] = useState([]);

    const [formType,setFormType] = useState('product')
    const [productTitle,setProductTitle] = useState('')
    const [productPrice,setProductPrice] = useState('')
    const [productImage,setProductImage] = useState('')
    const [productDesc,setProductDesc] = useState('')
    const [productCategory,setProductCategory] = useState('')

    const [currentProductCategory,setCurrentProductCategory] = useState([])
    const [productFilters,setProductFilters] = useState([])
    const [productId,setProductId] = useState('')

    const [categoryName,setCategoryName] = useState('')
    const [categoryImage,setCategoryImage] = useState('')
    const [categoryIsCheckbox,setCategoryIsCheckbox] = useState(true)
    const [categoryKeywords,setCategoryKeywords] = useState('')
    const [categoryFilters,setCategoryFilters] = useState([])

    const {user,isFetching} = useContext(UserContext);

    const [innerWidth,setInnerWidth] = useState(window.innerWidth)
    
    function handleResize(e){
        setInnerWidth(e.target.innerWidth)
    }
    useEffect(()=>{
        window.addEventListener('resize',(e)=>handleResize(e))
        return ()=>window.removeEventListener('resize',handleResize)
    },[])

    const renderAddFilters = categoryFilters.map((filter,index)=>
        <div className="new-category-filter">
            <div className="field">
                <label htmlFor={`filter-name-input-${index}`} className="form-label">Filter Name:
                </label>
                {actionType==='add' && <input type="text" value={filter.filterName} className="admin-input" id={`filter-name-input-${index}`} onChange={(e)=>handleFilterNameChange(e.target.value,index)}/>}
                {actionType==='update' && <div className="admin-input-disabled">{filter.filterName}</div>}
            </div>
            <label className="form-label">isCheckbox:
                <input type="checkbox" className="admin-input-checkbox" 
                checked={categoryFilters[index]?.isCheckbox}
                onChange={(e)=>handleCheckboxChange(e,index)} />
                {/* <input type="radiobox" className='checkbox-pop' /> */}
            </label>
            <div className="admin-filters-c">
                <label className='form-label'>Filter Values:</label>
                <div className="filter-values-list">
                    {categoryFilters[index]?.values.map((value,col)=>{
                        return <ResizableInput paramValue={value} UpdateText={(text)=>handleFilterValueChange(text,index,col)} />
                    })}
                    <button type='button' className="add-filter-value-btn" onClick={()=>handleAddFilterValue(index)}><MdOutlineAdd className='add-filter-icon' /></button>
                </div>
                    
                {/* <textarea name="filter-values" id={`filter-values-${index}`} ></textarea> */}
            </div>
        </div>
    )

    const renderProducts = data?.filter(product=>{
        if(search.get('item')=='') return true
        const rgx = new RegExp(search.get('item'),'gi')
        return rgx.test(product.title)
    }).map((product)=>(
        <div className="admin-product-main-c">
            <button key={product._id} className="admin-product-c" onClick={()=>handleItemInfoFill(product)}>
                <div className="admin-product-image-c">
                    <img src={product.image 
                        || "https://media.istockphoto.com/vectors/lost-items-line-vector-icon-unidentified-items-outline-isolated-icon-vector-id1271880340?k=20&m=1271880340&s=612x612&w=0&h=2uNB7AtHZiJOYHqCwQ_QeJnWhHwJEPtpNrNHqjaakuw="} alt="product image" className='product-image' />
                </div>
                <div className="admin-product-title">{product.title}</div>
                <div className="admin-product-price">{product.price}</div>
                {/* <div className="admin-product-desc">{product.description}</div> */}
                <div className="admin-product-rating">{product.rating}</div>
                <div className="admin-product-categories">Categories: {product.categories}</div>
                <button className="delete-product-btn" onClick={()=>handleItemDelete(product._id)}><RiDeleteBin7Line className='delete-product-icon' /></button>
            </button>
            <div className="desc-c">
                {product.description}
            </div>
        </div>
    ))
    // const renderProductFilters = categoryData?.categories
    // ?.filter((c)=>c==currentProductCategory)
    // .map((f)=>{
    //     console.log(f)
    // })
    


    function FetchData(){
        fetch('${process.env.API_URL}/admin').then(
            res=> res.json()
          ).then(
            data => {
                setData(data?.products)
                
            }
          )
        fetch('${process.env.API_URL}/admin/categories').then(
            res=> res.json()
          ).then(
            data => {
                setCategoryData(data)
                
            }
          )
    }

    useEffect(()=>{
        FetchData()
    },[])

    function handleItemInfoFill(product){
        setProductTitle(product.title)
        setProductPrice(product.price)
        setProductImage(product.image)
        setProductDesc(product.description)
        setProductId(product._id)
        setProductCategory(product.categories)
        const filters = product.filters.map((f)=>{
            const obj = {}
            f.values.forEach((v)=>{                     
                obj[v] = true
            })
            return Object.assign({...f},{values:obj})
        })
        setProductFilters(filters)
        console.log('filters',filters)
        fetch(`${process.env.API_URL}/category/${product.categories}`).then(
            res=>res.json()
        ).then(
            data=>{
                setCurrentProductCategory(data.category[0])
                // const filters = data?.category[0].filters.map((f)=>{
                //     return Object.assign({...f},{values:[]})
                // })
                // setProductFilters(filters);
            }
        )
        
    }

    function handleFillCategoryInfo(category){
        fetch(`${process.env.API_URL}/category/${category}`).then(
            res=>res.json()
        ).then(
            data=>{
                const categoryData = data.category[0]
                const {name,image,keywords,filters} = categoryData;
                setCategoryName(name)
                setCategoryImage(image)
                // setCategoryIsCheckbox
                setCategoryKeywords(keywords.join(','))
                setCategoryFilters(filters)
                console.log(categoryData)

            }
        )
    }

    function handleItemDelete(id){
        const requestOptions = {
            method:"DELETE",
            headers:{'Content-Type':"application/json"},
            body:JSON.stringify({})
          }
          fetch(`${process.env.API_URL}/admin/product/delete/${id}`,requestOptions).then(
            res=> res.json()
          ).then(
            data => {
                console.log(data)
                FetchData()
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
          
          fetch(`${process.env.API_URL}/admin/product/${actionType=='add'?"new":`update/${productId}`}`,requestOptions).then(
            res=> res.json()
          ).then(
            data => {
                if(data.Success) setPopup(data.message)
                else setErrorPopup(data.message)
                FetchData()
            }
          )

    }

    function handleCategoryFormSubmit(e){
        e.preventDefault();
        const valuesArr = e.target;
        const filtersArray = [...categoryFilters].map(filter=>{
            return Object.assign(filter,{values:filter.values.filter(v=>v!='')})
        })
        const requestOptions = {
            method:actionType=='add'?"POST":"PUT",
            headers:{'Content-Type':"application/json"},
            body: JSON.stringify({ 
                name: valuesArr[0].value,
                image: valuesArr[1].value,
                keywords: valuesArr[2].value.split(','),
                filters: filtersArray
          })
          }
          fetch(`${process.env.API_URL}/admin/category/${actionType=='add'?"new":`update/${valuesArr[0].value}`}`,requestOptions).then(
            res=> res.json()
          ).then(
            data => {
                if(data.Success) setPopup(data.message)
                else setErrorPopup(data.message)
                FetchData()
            }
          )

    }

    function handleAddFilter(){
        const filtersArray = [...categoryFilters,{
            filterName:'',
            values:[],
            isCheckbox: true
        }];
        setCategoryFilters([...filtersArray]);
    }

    function handleAddFilterValue(index){
        const filtersArray = [...categoryFilters];
        filtersArray[index]?.values.push('');
        setCategoryFilters([...filtersArray]);
    }

    function handleFilterNameChange(text,row){
        const filtersArray = [...categoryFilters];
        filtersArray[row].filterName = text;
        setCategoryFilters([...filtersArray]);
    }

    function handleFilterValueChange(text,row,col){
        const filtersArray = [...categoryFilters];
        filtersArray[row].values[col] = text;
        setCategoryFilters([...filtersArray]);
    }
    function handleCheckboxChange(e,row){
        const filtersArray = [...categoryFilters];
        filtersArray[row].isCheckbox = e.target.checked;
        setCategoryFilters([...filtersArray]);
    }

    function handleUpdateProductCategory(category){
        fetch(`${process.env.API_URL}/category/${category}`).then(
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

    function handleDeleteCategory(name){
        if(name){
            axios.delete(`${process.env.API_URL}/admin/category/delete/${name}`,{})
            .then(res=>{
                console.log(res)
            })
            .catch(e=>{
                console.log(e)
            })
        }
    }

    function handleProductFilterChange(e,value,row){
        const productFiltersArray = [...productFilters]
        productFiltersArray[row].values[value] = e.target.checked
        setProductFilters(productFiltersArray)
        
    }

    if(isFetching) return <LoadingPage/>
    return ( 
        (user.isAdmin && innerWidth>730)?<div className="admin">

            <div className="admin-c">
                <div className="admin-type-buttons-c">
                    <div className="type-buttons">
                        <button className={formType==='product'?"selected-btn":""} onClick={()=>setFormType('product')}>Product</button>-
                        <button className={formType==='product'?"":"selected-btn"} onClick={()=>setFormType('category')}>Category</button>/
                        <button onClick={()=>setActionType('add')} className={actionType==='add'?"selected-btn":""} >Add</button>-
                        <button onClick={()=>setActionType('update')} className={actionType==='add'?"":"selected-btn"} >Update</button>
                    </div>
                    {formType=='product' && 
                    <label htmlFor="search-admin-input" className="search-product-label">Search Item:
                        <input type="text" value={search.get('item')} onChange={(e)=>setSearch({item:e.target.value})} className="admin-input" id="search-admin-input" />
                    </label>}
                </div>
                <div className="admin-form-preview-c">
                    <div className="admin-form-c">
                        {formType=='product' && 
                        <form className="action-form" onSubmit={(e)=>handleProductFormSubmit(e)}>
                            <div className="field">
                                <label htmlFor="title-admin-input" className="form-label">Product Title:
                                </label>
                                <TextArea value={productTitle} id="title-admin-input" updateInput={(text)=>setProductTitle(text)} />
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
                                <TextArea value={productDesc} id="descr-admin-input" updateInput={(text)=>setProductDesc(text)} />
                            </div>
                            <label style={{marginTop:'2rem'}} className="form-label">Product Category:</label>
                            <SelectBox value={productCategory} optionsArray={categoryData?.categories} updateCategory={(category)=>handleUpdateProductCategory(category)} />
                            <ul className='filters-list'>{currentProductCategory?.filters?.map((filter,index)=>{
                                return <li key={index} className='admin-filter-c'>{filter.filterName}
                                            {filter.values.map((v)=>
                                                <div className="admin-filter-option">
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
                            {actionType=='add' && <button className='submit-add-btn submit-btn' type='submit'><MdOutlineLibraryAdd className='add-icon'/> Add Product</button>}
                            {actionType=='update' && <button className='submit-update-btn submit-btn' type='submit'><MdSystemUpdateAlt className='update-icon'/> Update</button>}
                        </form>}
                        {/* Category Modify Form */}
                        {formType=='category' && <div className="category-selectbox-c">
                            <SelectBox optionsArray={categoryData?.categories} updateCategory={(category)=>handleFillCategoryInfo(category)} />
                        </div>}
                        {formType=='category' && 
                        <form className="action-form" onSubmit={(e)=>handleCategoryFormSubmit(e)}>
                            <div className="field">
                                <label htmlFor="category-name-input" className="form-label">Name:</label>
                                <input type="text" className="admin-input" id="category-name-input" value={categoryName} onChange={(e)=>setCategoryName(e.target.value)} />
                            </div>
                            <div className="field">
                                <label htmlFor="category-image-input" className="form-label">Image:</label>
                                <input type="text" className="admin-input" id="category-image-input" value={categoryImage} onChange={(e)=>setCategoryImage(e.target.value)} />
                            </div>
                            <div className="field">
                            <label htmlFor="category-keywords-textarea" className="form-label">Keywords:
                            </label>
                            <TextArea placeholder='Key1,Key2,Key3 ...' value={categoryKeywords} id="category-keywords-textarea" updateInput={(keys)=>setCategoryKeywords(keys)}  />
                            {/* <textarea className="admin-textarea" name="category-keywords-textarea" id="category-keywords-textarea" placeholder='keyword1,keyword2,keyword3' value={categoryKeywords} onChange={(e)=>setCategoryKeywords(e.target.value)} ></textarea> */}
                            </div>

                            <div className="admin-filters-c">
                                <label htmlFor="category-filters-input" className="form-label">Category Filters:</label>
                                <div className="admin-filters">
                                        {renderAddFilters}
                                        <button type='button' className="add-filter-btn" onClick={(e)=>handleAddFilter(e)}>ADD FILTER</button>
                                </div>
                            </div>
                            {actionType=='add' && <button className='submit-add-btn submit-btn' type='submit'><MdOutlineLibraryAdd className='add-icon'/> Add Category</button>}
                            {actionType=='update' && <button className='submit-update-btn submit-btn' type='submit'><MdSystemUpdateAlt className='update-icon'/> Update</button>}
                            <button type='submit' className='submit-delete-btn submit-btn' onClick={()=>handleDeleteCategory(categoryName)}><AiFillDelete className='update-icon'/> Delete</button>
                        </form>}
                    </div>
                    { formType==='product' &&
                    <div className="admin-preview-c">
                        <h3 className='preview-heading'>Preview: </h3>
                        <div className="product-c">
                            <img src={productImage 
                            || "https://media.istockphoto.com/vectors/lost-items-line-vector-icon-unidentified-items-outline-isolated-icon-vector-id1271880340?k=20&m=1271880340&s=612x612&w=0&h=2uNB7AtHZiJOYHqCwQ_QeJnWhHwJEPtpNrNHqjaakuw="} 
                            alt="preview" className="product-image" />
                            <div className="product-info">
                                <div className="product-title">{productTitle}</div>
                                <div className="product-rating">{0} <span className='product-rating-count'>({0})</span></div>
                                <div className="product-price"><span>from</span> {productPrice} $</div>
                            </div>
                            
                        </div>
                    </div>}
                </div>
                
                
                
            </div>
            <PagesNav 
                activePage={activePage} 
                dataLength={Math.ceil(renderProducts.length/30)} 
                updatePage={(v)=>setActivePage(v)}
                />
                <div className="admin-products-list">
                    {renderProducts.slice(activePage*30,(activePage+1)*30)}
                </div>

            {popup && 
            <button className="popup" onClick={()=>setPopup(null)}>
                <h3 className='success-heading'>Success!</h3>
                <div className="message">{popup}</div>
            </button>}
            {errorPopup && 
            <button className="error" onClick={()=>setErrorPopup(null)}>
                <h3 className='success-heading'>Error!</h3>
                <div className="message">{errorPopup}</div>
            </button>}
        </div>: <Navigate to={'/'}/>
     );
}

export default Admin;