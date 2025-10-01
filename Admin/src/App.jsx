import React from 'react'
import Product from './Product'
import ProductList from './ProductList'
import EditProduct from './Editproduct'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import User from './User'
import Order from './Order'
import Dashboard from './dashboard'

const router=createBrowserRouter([
  {
    path:'/products',
    element:<ProductList/>
  },
  {
    path:'/edit/:id',
    element:<EditProduct/>
  },
  {
    path:'/product',
    element:<Product/>
  },
  {
    path:'/users',
    element:<User/>
  },
   {
    path:'/orders',
    element:<Order/>
  },
  {
    path:'/',
    element:<Dashboard/>
  }


])
const App = () => {
  return (
  <RouterProvider router={router}/>
  )
}

export default App

