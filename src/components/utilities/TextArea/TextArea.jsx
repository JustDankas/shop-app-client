import React, { Component } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './textArea.css'
function TextArea({id='',className='',value='',placeholder='',updateInput}) {
    const [input,setInput] = useState(value)
    const cols = 40

    useEffect(()=>{
        setInput(value)
    },[value])

    function handleInputChange(text){
        setInput(text)
        updateInput(text)
    }
    return ( 
        <textarea placeholder={placeholder} id={id} className={'custom-textarea '+className} value={input} cols={cols} 
        rows={input.length/cols>=2?Math.ceil(input.length/cols):2} 
        onChange={(e)=>handleInputChange(e.target.value)}></textarea>
     );
}

export default TextArea;