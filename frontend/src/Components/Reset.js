import { useState } from "react";
import { Link } from "react-router-dom";
import { ForgetUrl } from "../API/urls";
import { validateEmail } from "./validate";
import axios from "axios";
import "../css/Forget.css";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import '../css/Toastify.css';

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    try {
      const response = await axios.post(ForgetUrl, { email });
      // setMessage("Email sent! Please check your inbox.");
      console.log(response.data.msg);
      toast.success("Email Sent! Please Check your Inbox",{
        position:"bottom-right",
        theme: "colored"
      });
    } catch (error) {
      console.log(error.response.data.msg);
      toast.error(error.response.data.msg,{
        position:"bottom-left",
         theme: "colored"
      });
     
    }
  };
  const handleblur = (e)=>{
    setEmail(e.target.value);
    if (e.target.value === "") {
      setEmailError("");
    }
  }

  return (
    <div className="forget-password">
      <h1>
        Pa<span>lito.</span>
      </h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="Size">
            <h2>Reset Password</h2>
            <p>Enter your email address below</p>
          </div>
          <p>Email address</p>
          <input
            placeholder="samplemail@mail.com"
            onChange={(e) => setEmail(e.target.value)}
            required
            onBlur={handleblur}
          />
          {emailError && (
            <div className="ErrorMessage">
              <p>{emailError}</p>
            </div>
          )}
          <button type="submit">Reset</button>
           
      
          <div className="back-to-login">
            <Link className="Link-1" to="/Login">Back to Login</Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgetPassword;
