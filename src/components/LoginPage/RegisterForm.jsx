import React, { Component } from 'react';
import { useState } from 'react';
function RegisterForm() {

    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    function handleRegisterSubmit(e){
        e.preventDefault()
        const valuesArr = e.target;
        const requestOptions = {
            method:"POST",
            headers:{'Content-Type':"application/json"},
            body: JSON.stringify({ 
                "username":valuesArr[0].value,
                "email":valuesArr[1].value,
                "password":valuesArr[2].value,
          })
          }
          fetch('/auth/register',requestOptions).then(
            res=> res.json()
          ).then(
            data => {
                console.log(data)
            }
          )

    }

    return ( 
        <form className='register-form' onSubmit={(e)=>handleRegisterSubmit(e)}>
            <label className='field-label' htmlFor="username-input">Username:
                <input type="text" className="form-input" id='username-input' />
            </label>
            <label className='field-label' htmlFor="email-input">Email:
                <input type="text" className="form-input" id='email-input' />
            </label>
            <label className='field-label' htmlFor="password-input">Password:
                <input type="password" className="form-input" id='password-input' />
            </label>
            <button type='submit' className="submit-btn">Register</button>
        </form>
     );
}

export default RegisterForm;