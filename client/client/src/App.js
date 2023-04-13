import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import "./App.css";
import { BrowserRouter ,Routes, Route } from "react-router-dom";


import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";// login componet for user ...........
import SignUp from "./components/SignUp";
import HomePage from "./components/HomePage";
import ForgotPassword from "./components/ForgotPassword";
import ContactPage from "./components/ContactPage";
import Check_OTP from "./components/Check_OTP";
import ChangePassword from "./components/ChangePassword";
import AllRepositories from "./components/AllRepositories";
import BlockDetails from "./components/BlockDetails"
import Transaction from "./components/Transaction"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/homePage" element={<HomePage />} />
        <Route path="/checkOtp" element={<Check_OTP />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/allRepositories" element={<AllRepositories/>}/>
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/blockDetails" element={<BlockDetails />} />
        <Route path="/transaction" element={<Transaction/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

