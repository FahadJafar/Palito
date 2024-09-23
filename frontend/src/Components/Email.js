import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import "../css/Email.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Toastify.css';
import { validateEmail } from "./validate"; 

const Email = () => {
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const Nav = useNavigate();

  const handleBack = () => {
    localStorage.removeItem("tabs");
    Nav("/Home");
  };

  const handleChangeEmail = async () => {
    if (!currentEmail || !newEmail || !password) {
      toast.error("All fields are required!");
      return;
    }

    if (!validateEmail(currentEmail)) {
      toast.error("Invalid current email format.");
      return;
    }

    if (!validateEmail(newEmail)) {
      toast.error("Invalid new email format.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found");
        return;
      }

      const response = await axios.post(
        "https://palito-backend1.vercel.app/api/auth/updateEmail",
        { newEmail, password },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      localStorage.setItem("email", newEmail);
      toast.success(response.data.msg);
    } catch (err) {
      console.error(err);
      setError("Failed to update email");
    }
  };

  return (
    <div className="Email">
      <ToastContainer />
      <h2 onClick={handleBack} className="Icon1">
        <KeyboardBackspaceIcon className="Icon" />
        Back
      </h2>
      <div className="Email-Container">
        <h1>Change Email Address</h1>
        <p>
          To edit your email address, please enter your current email address, password, and the new email address. We will send you a confirmation email.
        </p>
        <h2>Current Email Address</h2>
        <input
          placeholder="Current Email"
          value={currentEmail}
          onChange={(e) => setCurrentEmail(e.target.value)}
          required
        />
        <h2>New Email Address</h2>
        <input
          placeholder="New Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          required
        />
        <h2>Password</h2>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button onClick={handleChangeEmail}>Change Email Address</button>
      </div>
    </div>
  );
};

export default Email;
