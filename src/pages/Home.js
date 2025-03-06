import React from 'react'

import Footer1 from '../COMPONENTS/Footer/Footer1'
import Footer2 from '../COMPONENTS/Footer/Footer2'
import HomeCategories from '../COMPONENTS/Category/HomeCategories'
import Navbar from '../COMPONENTS/Navbar/Navbar'





const Home = () => {


  return (
    <div>
      <Navbar reloadnavbar={false}/>
      <HomeCategories />

      <Footer1></Footer1>
      <Footer2 />
    </div>
  )
}

export default Home