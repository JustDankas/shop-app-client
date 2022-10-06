import React, { Component } from "react";
import { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useContext } from "react";
import UserContext from "../../userContext";
const {
  Group: FormGroup,
  Label: FormLabel,
  Control: FormControl,
  Text: FormText,
} = Form;
function Login() {
  // const [login,setLogin] = useState(true)
  // const {user} = useSelector((state)=>state)
  const { login, setFetching } = useContext(UserContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  // const [email,setEmail] = useState('')
  const [password, setPassword] = useState("");

  // useEffect(()=>{
  //     if(user.loggedIn){
  //         navigate('/')
  //     }
  // },[user])

  async function handleLoginSubmit(e) {
    e.preventDefault();

    await axios
      .post(`${process.env.REACT_APP_API_URL}auth/login`, {
        username,
        // email,
        password,
      })
      .then((res) => {
        console.log(res);
        localStorage.setItem("userInfo", JSON.stringify(res?.data?.data));
        login(res?.data?.data.user);
        setFetching(false);
        navigate(`/`);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  return (
    <div className="auth">
      <div className="form-c">
        <form className="form" onSubmit={(e) => handleLoginSubmit(e)}>
          <div className="form-field">
            <label htmlFor="form-username" className="form-user-label">
              Username
            </label>
            <input
              value={username}
              type="text"
              id="form-username"
              className="form-user-input"
              onChange={(e) => setUsername(e.target.value)}
            />
            <span className="form-span"></span>
          </div>
          {/* <div className="form-field">
                            <label htmlFor="form-email" className="form-user-label">Email</label>
                            <input value={email} type="text" id='form-email' 
                            className="form-user-input" 
                            onChange={(e)=>setEmail(e.target.value)}
                            />
                            <span className="form-span">example: john-doe@example.com</span>
                        </div> */}
          <div className="form-field">
            <label htmlFor="form-password" className="form-user-label">
              Password
            </label>
            <input
              value={password}
              type="password"
              id="form-password"
              className="form-user-input"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="form-span"></span>
          </div>
          <button className="login-btn" type="submit">
            Login
          </button>
          <span className="meta-span">
            New user? <Link to={`/auth/register`}>Create an account here!</Link>
          </span>
        </form>
      </div>
    </div>
  );
}

export default Login;
