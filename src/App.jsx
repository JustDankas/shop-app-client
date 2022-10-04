import { useEffect } from 'react';
import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { Admin, CategoryPage, Footer, Header, Home, Login, MyAccount, NotFoundPage, ProductDetails, ProductsListing, ProfileHeader, Protected, Register, SearchPage } from './components';
// import {useDispatch, useSelector} from 'react-redux';
// import { login } from './redux/userSlice';
import axios from 'axios';
import { useState } from 'react';
import UserContext, { UserProvider } from './userContext';
import { useContext } from 'react';
import LoadingPage from './components/LoadingPage/LoadingPage';

function App() {

  const [userLoggedIn,setUserLoggedIn] = useState(false)
  // const dispatch = useDispatch();
  const {user,login,logout,setFetching} = useContext(UserContext)

  // Automatically login
  useEffect(()=>{
    let userInfo = localStorage.getItem('userInfo')
    if(userInfo){
      userInfo = JSON.parse(userInfo)
      setFetching(true)
      axios.post(`${process.env.API_URL}/auth/auto/login`,{
        token:userInfo.token
      }).then(res=>{
        const userData = res?.data?.data
        console.log(userData)
        // dispatch(login({
        //   user:userData.user
        // }))
        login(userData?.user)
        
      }).catch(e=>{
        console.log(e)
        setFetching(false)
      })
    }
    else{
      setFetching(false) 
    }
     
    

  },[])
  
  return (
    <div className="App">

        <BrowserRouter>
          <Header/>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/categories/:catName' element={<CategoryPage/>} />
            <Route path='/products/:productId/:productName' element={<ProductDetails/>} />
            <Route path='/auth/login' element={<Login/>} />
            <Route path='/auth/register' element={<Register/>} />
            <Route path='/search' element={<SearchPage/>} />
            <Route element={<Protected/>}>
              <Route path='/admin' element={<Admin/>} />
            </Route>
            <Route element={<Protected/>}>
                <Route path='/account/my-account/*' element={<MyAccount/>}/>
            </Route>
            <Route path='/*' element={<NotFoundPage/>} />
          </Routes>
          <Footer/>
        </BrowserRouter>

    </div>
  );
}

export default App;
