import React, { Component } from 'react';
import { useDispatch } from 'react-redux';
import {login} from '../../redux/userSlice';

function LoginForm() {

    const dispatch = useDispatch();


    function handleLoginSubmit(e){
        e.preventDefault()
        const valuesArr = e.target;
        const requestOptions = {
            method:"POST",
            headers:{'Content-Type':"application/json"},
            body: JSON.stringify({ "username":valuesArr[0].value,
              "password":valuesArr[1].value,
          })
          }
          fetch('/auth/login',requestOptions).then(
            res=> res.json()
          ).then(
            data => {
                if(data?.Success){
                    const payload = {
                        user:data.user,
                        loggedIn:true
                    }
                    dispatch(login(payload))
                }
                else if(!data?.Success){
                    console.log(data.message)
                }

            }
          )


    }

    return ( 
        <form className='login-form' onSubmit={(e)=>handleLoginSubmit(e)}>
            <label className='field-label' htmlFor="username-input">Username:
                <input type="text" className="form-input" id='username-input' />
            </label>
            <label className='field-label' htmlFor="password-input">Password:
                <input type="password" className="form-input" id='password-input' />
            </label>
            <button type='submit' className="submit-btn">Login</button>
        </form>
     );
}

export default LoginForm;