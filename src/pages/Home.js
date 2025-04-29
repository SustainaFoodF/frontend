import React from "react";

import Footer1 from "../COMPONENTS/Footer/Footer1";
import Footer2 from "../COMPONENTS/Footer/Footer2";
import HomeCategories from "../COMPONENTS/Category/HomeCategories";
import Navbar from "../COMPONENTS/Navbar/Navbar";
import PostsComponent from "../COMPONENTS/Posts";
import BarcodeScanner from "../COMPONENTS/BarcodeScanner/BarcodeScanner"; 

const Home = () => {
  return (
    <div>
      <Navbar reloadnavbar={false} />
      <HomeCategories />
      <div className="container mt-4 mb-5">
        <BarcodeScanner />
      </div>
      <PostsComponent />
      <Footer1></Footer1>
      <Footer2 />
    </div>
  );
};

export default Home;
