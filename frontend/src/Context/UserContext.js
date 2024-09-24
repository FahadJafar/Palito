import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState({
    fname: "",
    lname: "",
    email: "",
  });

  const token = localStorage.getItem("token");
  const baseURL = "https://palito-backend1.vercel.app/";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`${baseURL}api/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const foldersResponse = await axios.get(`${baseURL}api/auth/folders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update states based on responses
        setProfileImage(userResponse.data.profileImage || "../Img/pro.jpg");
        setUserData({
          fname: userResponse.data.firstName,
          lname: userResponse.data.lastName,
          email: userResponse.data.email,
        });
        setFolders(foldersResponse.data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchUserData();
  }, [token]);

  return (
    <AppContext.Provider value={{ folders, setFolders, profileImage, userData }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
