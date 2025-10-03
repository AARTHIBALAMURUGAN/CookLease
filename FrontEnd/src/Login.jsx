
import {Link,useNavigate} from "react-router-dom";
import axios from 'axios'
import { useState } from 'react';
const Login = () => {

  const navigate=useNavigate()

  const[email,setemail]=useState('')
  const[password,setpassword]=useState('')
  const [errors,seterrors]=useState({})

  const login=async(e)=>{
    
    e.preventDefault()


    try{const res= await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/login`,{
      email,password  
    })
    localStorage.setItem("token",res.data.tokens)
    localStorage.setItem("userId",res.data.user._id)
   
    alert("User Logged in")
    navigate('/')
    setemail('')
    setpassword('')
    // After successful login


  }
      catch(e){
         if(e.response&&e.response.data&&e.response.data.message){
            const backendMessage=e.response.data.message
   seterrors({general:backendMessage})
         }
            else{
seterrors({general:"Login Failed"})

            }
        

    
    
}
  
  



  }

  return (
    <>
    

      <div className="login-container">
      <div className="login-card">


        <form onSubmit={login}>
        <h2>Login</h2>
        {errors.general && <div className="alert alert-danger">{errors.general}</div>}
        <div className="login-form">
          <label htmlFor="email">Email</label>
          <input type="email" value={email} onChange={(e)=>{setemail(e.target.value),seterrors({})}} name="email" placeholder="Enter your email" />

          <label htmlFor="pw">Password</label>
          <input type="password" value={password} onChange={(e)=>{setpassword(e.target.value),seterrors({})}}name="pw" placeholder="Enter your password" />

          <button type="submit" >Login</button>
          <p>Don't have an account? <Link to='/sign-up'className="signup-link">Sign-Up</Link></p>
        </div>
        </form>
      </div>
    </div>
    </>
  )
}

export default Login
