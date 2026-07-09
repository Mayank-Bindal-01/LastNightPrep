import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Branch from "./pages/Branch";
import Subject from "./pages/Subject";

import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import SubjectSearch from "./components/SubjectSearch";

import UploadFile from "./pages/UploadFile";


function App(){

  return(

    <>

      <Navbar />


      <Routes>


        {/* Home */}

        <Route
          path="/"
          element={<Home/>}
        />


        {/* Search Subjects */}

        <Route
          path="/search"
          element={<SubjectSearch/>}
        />


        {/* Branch */}

        <Route
          path="/branch/:branchCode"
          element={<Branch/>}
        />



        {/* Subject */}
        
        <Route
  path="/subject/:branchCode/:semester/:subjectName"
  element={<Subject />}
/>
        



        {/* Authentication */}


        <Route
          path="/register"
          element={<Register/>}
        />


        <Route
          path="/login"
          element={<Login/>}
        />


        <Route
          path="/verify-email/:token"
          element={<VerifyEmail/>}
        />


        <Route
          path="/forgot-password"
          element={<ForgotPassword/>}
        />


        <Route
          path="/reset-password/:token"
          element={<ResetPassword/>}
        />



        {/* Upload */}

        <Route
          path="/upload"
          element={<UploadFile/>}
        />


      </Routes>


    </>

  );

}


export default App;