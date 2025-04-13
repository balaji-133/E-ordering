import React, { useContext, useEffect } from 'react'
import './LoginpopUp.css'
import { useState } from 'react'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginpopUp = ({setShowLogin}) => {

    const {url,setToken} = useContext(StoreContext)

    const [currentState,setCurrentState]=useState("Login")
    const [data,setData]=useState({
        name:"",
        email:"",
        password:""
    })

    const onChangeHandler=(e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setData(data=>({...data,[name]:value}))
    }

    const onLogin = async(e)=>{
        e.preventDefault()
        let newUrl = url;
        if(currentState === "Login"){
            newUrl = newUrl + "/api/user/login"
        }
        else{
            newUrl = newUrl + "/api/user/register"
        }
        const response = await axios.post(newUrl,data)
        if(response.data.success){
            setToken(response.data.token);
            localStorage.setItem("token",response.data.token);
            setShowLogin(false)
        }
        else{
            alert(response.data.message)
        }
    }

    useEffect(()=>{
        console.log(data);
    },[data])

  return (
    <div className="login-pop">
        <form onSubmit={onLogin} className='login-popup-container'>
            <div className="login-popup-title">
                <h2>{currentState}</h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
            </div>
            <div className="login-popup-input">
                {
                    currentState === "Login"?<></>:<input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />
                }
                <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Your password' required />
            </div>
            <button type='submit'>{currentState === "Sign up"?"Create Account":"Login"}</button>
            <div className="login-popup-condition">
                <input type="checkbox" required />
                <p>By continuing i agree terms and policies</p>
            </div>
            {
                currentState === "Login"
                ?<p>Create a new account?  <span onClick={()=>setCurrentState("Sign Up")}>Click Here</span></p>
                :<p>Already have an account? <span onClick={()=>setCurrentState("Login")}>Login here</span></p>
            }
        </form>
    </div>
  )
}

export default LoginpopUp