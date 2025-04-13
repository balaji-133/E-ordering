import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import Cart from "./pages/cart/Cart";
import Home from "./pages/Home/home";
import Placeorder from "./pages/placeOrder/Placeorder";
import Footer from "./components/footer/Footer";
import LoginpopUp from "./components/LoginPop/LoginpopUp";
import Verify from "./pages/verify/Verify.jsx";
import Myorders from "./pages/myorders/Myorders.jsx";

const App = () => {
  const [showLogin,setShowLogin]=useState(false);
  return (
    <>
    {
      showLogin?<LoginpopUp setShowLogin={setShowLogin}/>:<></>
    }
      <div className="app">
        <Navbar setShowLogin={setShowLogin}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Placeorder />} />
          <Route path="/verify" element={<Verify/>} />
          <Route path="/myorders" element={<Myorders/>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
