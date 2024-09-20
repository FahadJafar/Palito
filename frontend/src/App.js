import Login from "./Components/Login";
import Signup from "./Components//Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Reset from "./Components/Reset";
import ResetPass from "./Components/ResetPass";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import Setting from "./Components/Setting";

function App() {
  return (
    <div className="App">
      
      <Router>
   
        <Routes>
      
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/reset-password/:token" element={<ResetPass />} />
          <Route path="/Reset" element={<Reset />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Navbar" element={<Navbar/>}/>
          <Route path="/Setting" element={<Setting/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
