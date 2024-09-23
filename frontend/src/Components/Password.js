import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import "../css/Password.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Toastify.css";
import { validatePassword } from "./validate"; 

const Password = () => {
  const [newPass, setNewPass] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const Nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validatePassword(newPass, confPass);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const obj = {
      oldPassword: oldPass,
      newPassword: newPass,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://palito-backend1.vercel.app/api/auth/changePassword",
        obj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.msg);
      setOldPass("");
    setNewPass("");
    setConfPass("");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        toast.error(err.response.data.msg);
      } else {
        toast.error("An error occurred while changing the password");
      
      }
    }
  };

  const handleback = () => {
    localStorage.removeItem("tabs");
    Nav("/Home");
  };

  return (
    <div className="Password">
      <h2 className="Icon1">
        <KeyboardBackspaceIcon className="Icon" onClick={handleback} />
        Back
      </h2>

      <div className="Password-Container">
        <h1>Change Password</h1>

        <h2>Old Password</h2>
        <input
          type="password"
          placeholder="********"
          required
          onChange={(e) => setOldPass(e.target.value)}
        />
        <h2>New Password</h2>
        <input
          type="password"
          placeholder="********"
          required
          onChange={(e) => setNewPass(e.target.value)}
        />
        <h2>Confirm Password</h2>
        <input
          type="password"
          placeholder="********"
          required
          onChange={(e) => setConfPass(e.target.value)}
        />

        <button onClick={handleSubmit}>Change Password</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Password;
