import React, { Component } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './resizableInput.css'
function ResizableInput({paramValue='',UpdateText}) {

    const [value,setValue] = useState('')

    useEffect(()=>{
        setValue(paramValue)
    },[paramValue])

    function handleValueChange(txt){
        setValue(txt)
        UpdateText(txt)
    }
    console.log(value.length)
    return ( 
            <input type="text" 
            value={value}
            style={{width:Math.ceil(value.length*0.83)+'rem'}}
            className="filter-value"
            onChange={(e)=>handleValueChange(e.target.value)} />
     );
}

export default ResizableInput;