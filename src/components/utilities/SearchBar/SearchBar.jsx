import React, { Component } from 'react';
import './searchBar.css';
import {FiSearch} from 'react-icons/fi';
import { useRef } from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

function SearchBar() {

    const inputEl = useRef(null)
    const navigate = useNavigate()

    function handleSearchTerm(){
        const regex = new RegExp(/[a-zA-Z0-9\s]/,'gi')
        const input = inputEl.current.value.toLowerCase()
        const searchTerm = input.match(regex).join('')

        if(searchTerm.length>1){
            navigate(`/search?keyphrase=${searchTerm}`)

        }
    }

    function KeyDown(key){
        if(key==='Enter'){
            handleSearchTerm()
        }
    }

    return ( 
        <div className="searchbar-c">
            <input 
            ref={inputEl}
            className='searchbar-input' 
            type="text"
            placeholder='Search for an item'
            onKeyDown={(e)=>KeyDown(e.key)}
            />
            <button className='search-btn' onClick={()=>handleSearchTerm()}>
                <FiSearch className='search-icon'/>
            </button>
        </div>
     );
}

export default SearchBar;