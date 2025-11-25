import Homepage from "./Pages/Homepage"
import Dashboard from "./Pages/Dashboard"
import CropInput from "./Pages/CropInput"
import CropResult from "./Pages/CropResult"
import DiseaseInput from "./Pages/DiseaseInput"
import DiseaseResult from "./Pages/DiseaseResult"
import SoilInput from "./Pages/SoilInput"
import SoilResult from "./Pages/SoilResult"
import { BrowserRouter,  Routes, Route } from "react-router-dom"

function App() {
  

  return (
    <>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Homepage/>}/>
              <Route path="/dashboard" element={<Dashboard/>}/>

              <Route path="/crop-input" element={<CropInput/>}/>
              <Route path="/crop-result" element={<CropResult/>}/>

              <Route path="/disease-input" element={<DiseaseInput/>}/>
              <Route path="/disease-result" element={<DiseaseResult/>}/>
              
              <Route path="/soil-input" element={<SoilInput/>}/>
              <Route path="/soil-result" element={<SoilResult/>}/>
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
