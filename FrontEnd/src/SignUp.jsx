import {useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios'

const SignUp = () => {

  const navigate=useNavigate()
    const [name,setname]=useState('')
    const [phone,setphone]=useState('')
    const[email,setemail]=useState('')
    const[password,setpassword]=useState('')
    const[errors,setError]=useState({})
const Validation=()=>{

    let newError={}
    if(!name.trim()) 
      {newError.name="Name is required"}
    else if(! /^[A-Za-z\s]+$/.test(name)){
      newError.name="Name can only contains letters"}

      if(!phone.trim()) 
      {newError.phone="Phone no is required"}
    else if(! /^(\+91[\-\s]?)?[6-9]\d{9}$/.test(phone)){
      newError.phone="Phone no must be in 10 digits"}

    if(!email.trim()){

     newError.email="Email is required"}

    else if( !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)){
      newError.email="Email must be in valid Gmail format"}
   

   if(!password.trim()) {newError.password="Password is required"}
    else if( !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)){
      newError.password="Password must be 8 chars with uppercase, lowercase, number & symbol"}
   
    setError(newError)
    return Object.keys(newError).length===0

    }

const signup=async(e)=>{

    e.preventDefault()
    if (!Validation()) return;
    
  try{  const res=await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/register`,{
        name,phone,email,password
    })
    alert("User Created Successfully")
    navigate('/login')
    setname('')
    setphone('')
    setemail('')
    setpassword('')
    setError({})
  }
  catch(e){
    if(e.response&&e.response.data&&e.response.data.message){
        const backendMessage=e.response.data.message
        setError({general:backendMessage})
    }
    else{
        setError({general:"Registration Failed"})
    }
  }

}

  return (
     <div className="signup-container">
      <div className="signup-card">
        <form onSubmit={signup}>
          <h2>Signup</h2>
            {errors.general && <div className="alert alert-danger">{errors.general}</div>}
          <label htmlFor="name">Name</label>
          <input    className={`form-control ${errors.name ? "is-invalid" : ""}`}type="text" name="name" value={name}  onChange={(e)=>{setname(e.target.value),setError({})}} placeholder="Enter your name" />
  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          <label htmlFor="phone">Phone</label>
          <input     className={`form-control ${errors.phone ? "is-invalid" : ""}`}type="text" name="phone"  value={phone}  onChange={(e)=>{setphone(e.target.value),setError({})}}placeholder="Enter your phone" />
  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          <label htmlFor="email">Email</label>
          <input    className={`form-control ${errors.email? "is-invalid" : ""}`}type="email" name="email"  value={email}  onChange={(e)=>{setemail(e.target.value),setError({})}}placeholder="Enter your email" />
  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          <label htmlFor="password">Password</label>
          <input    className={`form-control ${errors.password ? "is-invalid" : ""}`}type="password" name="password" value={password}  onChange={(e)=>{setpassword(e.target.value),setError({})}} placeholder="Enter your password" />
  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          <button type="submit">Sign Up</button>

          <p>
            Already have an account?{" "}
            <Link to="/" className="login-link">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignUp
