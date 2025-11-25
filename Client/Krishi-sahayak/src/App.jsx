import Homepage from "./Pages/Homepage"
import Navbar from "./Components/Navbar"
import Dashboard from "./Pages/Dashboard"
import { BrowserRouter, Router, Routes, Route } from "react-router"

function App() {
  

  return (
    <>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Homepage/>}/>
              <Route path="/dashboard" element={<Dashboard/>}/>
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
