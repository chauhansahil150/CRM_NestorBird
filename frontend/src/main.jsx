import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import LoginForm from './pages/Login.jsx'
const router=createBrowserRouter([

  {
    path:'/',
    element:<App/>,
    children:[
      {
          path:'login',
          element:<LoginForm />  
      },
      {
          path:'register',
          element:<Register/>
      },
      {
          path:'home',
          element:<Home/>
      }
  ]
  
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
