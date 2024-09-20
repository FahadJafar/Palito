import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Tabss from "./Tabs";
import Setting from "./Setting";
import Email from "./Email";
import "../css/Home.css";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import Password from "./Password";

const Home = () => {
  const location = useLocation();
  const [currentView, setCurrentView] = useState('tabs'); 
  useEffect(() => {
    const token = localStorage.getItem('showSettings');
    if (token === '1') {
      setCurrentView('settings');
    } else {
      setCurrentView('tabs');
    }
  }, [location]);

  const showEmail = () => {
    setCurrentView('email');
  };
  const showPass = () => {
    setCurrentView('password');
  };

  const showSettings = () => {
    setCurrentView('settings');
  };

  return (
    <div className="Home-Container">
      <div className="Outside-Container">
        <Navbar />
      </div>

      <div className="Inside-Container">
        {currentView === 'settings' && <Setting onEmailEdit={showEmail} onPassEdit={showPass} />}
        {currentView === 'tabs' && <Tabss />}
        {currentView === 'email' && <Email />}
        {currentView === 'password' && <Password/>}
      
    
      </div>

      <ToastContainer />
    </div>
  );
};

export default Home;