import React from 'react'
import {createBrowserRouter,RouterProvider}from 'react-router-dom'
import Login from './Login'
import SignUp from './SignUp'
import Products from './Products'
import Profile from './Profile'
import ProductDetail from './ProductDetail'
import { CartProvider } from './CartContext'
import Cart from "./Cart";
import Orders from './Orders'

const router=createBrowserRouter([
{
  path:'/login',
  element: <Login/>
},
{
  path:'/sign-up',
  element:  <SignUp/>
},
{
  path:'/',
  element:<Products/>
},
{
  path:'/profile',
  element:<Profile/>
},
{
  path:'/product/:id',
  element:<ProductDetail/>
},
{
  path:'/cart',
  element:<Cart/>
},{
  path:'/orders',
  element:<Orders/>
}
])

const App = () => {
  return (
    <CartProvider>
     <RouterProvider router={router}/>
     </CartProvider>
      
     
      
      
    
  )
}

export default App
