import React, { Component } from 'react';
import { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import './register.css';
import {GrStatusWarning} from 'react-icons/gr';
import { useContext } from 'react';
import UserContext from '../../userContext';
function Register() {

    const [warningPopup,setWarningPopup] = useState(null)

    const {login} = useContext(UserContext)
    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate()
    // useEffect(()=>{
    //     if(user.loggedIn){
    //         navigate('/')
    //     }
    // },[user])

    function handleRegisterSubmit(e){
        e.preventDefault()

        axios.post(`${process.env.REACT_APP_API_URL}/auth/register`,{
            username,
            email,
            password,
        }).then(res=>{
            localStorage.setItem('userInfo',JSON.stringify(res?.data?.data))
            login(res?.data?.data?.user)
            navigate('/')
        }).catch(e=>{
            console.log(e)
            setWarningPopup(e.response.data.message)
        })
    }   

    return ( 
        <div className="auth">
                <div className="form-c">
                    <form className='form' onSubmit={(e)=>handleRegisterSubmit(e)}>
                        <div className="form-field">
                            <label htmlFor="form-username" className="form-user-label">Username</label>
                            <input value={username} type="text" id='form-username' 
                            className="form-user-input" 
                            onChange={(e)=>setUsername(e.target.value)}
                            />
                            <span className="form-span"></span>
                        </div>
                        <div className="form-field">
                            <label htmlFor="form-email" className="form-user-label">Email</label>
                            <input value={email} type="email" id='form-email' 
                            className="form-user-input" 
                            onChange={(e)=>setEmail(e.target.value)}
                            />
                            <span className="form-span">example: john-doe@example.com</span>
                        </div>
                        <div className="form-field">
                            <label htmlFor="form-password" className="form-user-label">Password</label>
                            <input value={password} type="password" id='form-password' 
                            className="form-user-input" 
                            onChange={(e)=>setPassword(e.target.value)}
                            />
                            <span className="form-span"></span>
                        </div>
                        <button className='login-btn' type='submit'>Register</button>
                        <span className="meta-span">Already registered? <Link to={'/auth/login'}>Login here!</Link></span>
                    </form>
                </div>
                {warningPopup && <button className="warning" onClick={()=>setWarningPopup(null)}>
                    <h3 className="success-heading">Warning!</h3>
                    <div className="row">
                        <GrStatusWarning className='warning-icon'/>
                        <div className="message">{warningPopup}</div>
                    </div>

                </button>}
        </div>
     );
}

export default Register;