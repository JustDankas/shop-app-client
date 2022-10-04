import React, { Component } from 'react';
import { useState } from 'react';
import './selectBox.css';
import {IoMdArrowDropdown} from 'react-icons/io';
import { useEffect } from 'react';
function SelectBox({value,optionsArray,updateCategory}) {

    const [optionsFilter,setOptionsFilter] = useState(value);
    const [showOptions,setShowOptions] = useState(false)

    const renderOptions = optionsArray?.filter(({name})=>{
        if(optionsFilter=='') return true
        const rgx = new RegExp(optionsFilter,'i')
        return rgx.test(name)
    }).map(({name},index)=>
    <button type='button' key={index} className="option" onClick={()=>handleSetCategory(name)}>
        <input type="radio" className="radio" id={name}  name='category' onSelect={(e)=>console.log(e)} />
        <label className='option-label' htmlFor={name}>{name}</label>
    </button>
    )

    useEffect(()=>{
        setOptionsFilter(value)
    },[value])

    function handleSetCategory(category){
        setOptionsFilter(category)
        updateCategory(category)
    }

    return ( 
        <div className="select-box-c">
            <div className="select-box">
                <div className="select-input-c">
                    <input type="text" placeholder='Select Category' 
                    className="selected" value={optionsFilter} 
                    onClick={()=>setShowOptions(true)}
                    onChange={(e)=>setOptionsFilter(e.target.value)} />
                    <IoMdArrowDropdown className={showOptions?"arrow-icon down":"arrow-icon up"} onClick={()=>setShowOptions(!showOptions)}/>
                </div>
            </div>
            <div className="options-c">
                {showOptions && renderOptions}
            </div>
        </div>

     );
}

export default SelectBox;
