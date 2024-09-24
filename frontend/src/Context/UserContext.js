
import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");

  const token = localStorage.getItem("token");
  const baseURL = "https://palito-backend1.vercel.app/";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${baseURL}api/auth/USER`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileImage(res.data.profileImage || "../Img/pro.jpg");
        setFname(res.data.firstName);
        setLname(res.data.lastName);
        setEmail(res.data.email);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchUserData();
  }, [token,fname, lname, email, profileImage]);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await axios.get(`${baseURL}api/auth/folders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFolders(res.data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchFolders();
  }, [token,fname, lname, email, profileImage]);

  return (
    <AppContext.Provider value={{ folders, setFolders, profileImage,setProfileImage, fname,setFname, lname,setLname, email,setEmail }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
