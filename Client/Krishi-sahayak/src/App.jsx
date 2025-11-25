import Homepage from "./Pages/Homepage"
import Navbar from "./Components/Navbar"
import Dashboard from "./Pages/Dashboard"
import CropInput from "./Pages/CropInput"
import DiseaseInput from "./Pages/DiseaseInput"
import SoilInput from "./Pages/SoilInput"
import { BrowserRouter, Router, Routes, Route } from "react-router-dom"

function App() {
  

  return (
    <>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Homepage/>}/>
              <Route path="/dashboard" element={<Dashboard/>}/>

              <Route path="/crop-input" element={<CropInput/>}/>

              <Route path="/disease-input" element={<CropInput/>}/>
              
              <Route path="/soil-input" element={<CropInput/>}/>
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
