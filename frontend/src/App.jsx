import {Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import Branch from "./pages/Branch";
import Semester from "./pages/Semester";
import Navbar from "./components/Navbar";


function App(){
  return (
    <Routes>
      <Route path="/" element={
        <>
        <Navbar />
        <Home  />
        </>
      }  />
      <Route path="/branch" element={<Branch />} />
      <Route path="/semester" element={<Semester />} />
      <Route path="/subject" element={<h1> Subject Page </h1>} />

    </Routes>
  )
}

export default App;
