import React from 'react'
import Navbar from '../components/Navbar.jsx'
import { Outlet } from 'react-router-dom'
import Footer from './Footer.jsx'

const LayoutNavbar = () => {
  return (
    <>
        <Navbar />
        <main className='min-h-screen'>
           <Outlet /> 
        </main>
        <Footer />
    </>
  )
}

export default LayoutNavbar