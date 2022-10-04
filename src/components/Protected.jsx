import React, { Component } from 'react';
import { useContext } from 'react';
import { useState,useEffect } from 'react';
import { Navigate,Outlet } from 'react-router-dom';
import UserContext from '../userContext';
function Protected() {

    const {user,isFetching} = useContext(UserContext)
    console.log(user)
    console.log(isFetching)
    if(isFetching) return 'Loading ...'
    return ( 
        user!==null?<Outlet/>:<Navigate to={`${process.env.PORT}/auth/login`}/>
     );
}

export default Protected;