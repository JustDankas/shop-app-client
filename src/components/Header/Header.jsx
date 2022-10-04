import React, { Component } from 'react';
import SearchBar from '../utilities/SearchBar/SearchBar';
import './header.css';
import {Link, useLocation} from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {logout} from '../../redux/userSlice'
import { useContext } from 'react';
import UserContext from '../../userContext';
import {AiOutlineUser,AiOutlineClose,AiFillHeart,AiFillStar} from 'react-icons/ai';
import {GiHamburgerMenu} from 'react-icons/gi';
import {MdAdminPanelSettings} from 'react-icons/md';
import {BsFillPersonFill,BsFillCartFill} from 'react-icons/bs';
import { useState } from 'react';
import Cart from '../Cart/Cart';


function Header() {

    const [innerWidth,setInnerWidth] = useState(window.innerWidth)
    const [isActive,setIsActive] = useState(false)
    const {user,logout} = useContext(UserContext);
    const [activeMenu,setActiveMenu] = useState(false)

    const [options,setOptions] = useState([
        {
            title:'My account',
            link:`/account/my-account`,
            icon:<BsFillPersonFill className='nav-icon'/>
        },
        {
            title:'Favourite',
            link:`/account/my-account/favourites`,
            icon:<AiFillHeart className='nav-icon'/>
        },
        {
            title:'Reviews',
            link:`/account/my-account/reviews`,
            icon:<AiFillStar className='nav-icon'/>
        },
    ])

    const location = useLocation();

    const renderOptions = options.map((option,index)=>{
        return (
            <Link key={index} className="dropbox-link" to={option.link}>
                <li className="dropbox-li">{option.title}</li>
            </Link>)
    })

    function windowClick(event){
        const path = event.path.filter(x=>{
            return x.className==='profile-c'
        })
        if(path.length<1){
            setIsActive(false)
        }
        
    }

    function handleResize(e){
        setInnerWidth(e.target.innerWidth)
    }
    useEffect(()=>{
        window.addEventListener('resize',(e)=>handleResize(e))
        return ()=>window.removeEventListener('resize',handleResize)
    },[])

    useEffect(()=>{
        window.addEventListener('mousedown',(e)=>windowClick(e))
        return ()=> window.removeEventListener('mousedown',windowClick)
    },[])
    
    function handleLogout(){
        localStorage.removeItem('userInfo');
        logout();
        
    }

    useEffect(()=>{
        setIsActive(false)
    },[location])

    function handleMenuClick(){
        setActiveMenu(!activeMenu)
    }

    return ( 
        <>
            <header className='header'>
                {user && innerWidth<=1080 && 
                    <button className='menu-btn'
                    onClick={()=>setActiveMenu(true)}>
                        <GiHamburgerMenu className='burger-menu'/>
                    </button>
                }
                <div className="responsive-flex">
                    <Link to='/' className='logo-link' ><h1 className="logo">skroutz</h1></Link>
                    <SearchBar/>
                </div>

                {!user && <div className="user-auth-c">
                    <Link to={'/auth/login'} className="header-auth">login</Link>/
                    <Link to={'/auth/register'} className="header-auth">register</Link>
                </div>}
                {user && innerWidth>1080 &&
                <div className="user-header-c">
                    <Cart />
                    <div className="profile-c">
                        <button className="profile-img-c" onClick={()=>setIsActive(!isActive)}>
                            <AiOutlineUser className='user-icon'/>
                        </button>
                        {isActive && 
                        <div className="drop-box-c">
                            <div className="triangle"></div>
                            <ul className="drop-box">
                                {renderOptions}
                                {user && user.isAdmin && 
                                <Link className="dropbox-link" to={'/admin'}>
                                    <li className="dropbox-li">Admin</li>
                                </Link>}
                                <button className='logout-btn' onClick={()=>handleLogout()}><li className="dropbox-li btn-li">Logout</li></button>
                                
                            </ul>
                        </div>
                        }
                    </div>
                </div>
                }
            </header>
            {activeMenu && innerWidth<=1080 &&
            <nav className='mobile-nav'>
                <div className='nav-option-div'>
                    <button onClick={()=>setActiveMenu(false)} className='close-menu-btn'><AiOutlineClose className='close-icon'/></button>
                </div>
                {options.map((option,index)=>(
                    <Link key={index} className='nav-option-link' to={option.link}>
                        <div className="nav-option-title">{option.icon}{option.title}</div>
                    </Link>
                ))}
                <Link className='nav-option-link' to={"/account/my-account/cart"}>
                    <div className="nav-option-title"><BsFillCartFill className='nav-icon'/>My Cart</div>
                </Link>
                {user.isAdmin && 
                <Link className='nav-option-link' to={"/admin"}>
                    <div className="nav-option-title"><MdAdminPanelSettings className='nav-icon'/>Admin</div>
                </Link>}

            </nav>}
        </>

     );
}

export default Header;