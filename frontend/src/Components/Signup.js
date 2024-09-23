import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupUrl } from "../API/urls";
import { validatePassword, validateEmail } from "./validate";
import "../css/Signup.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Toastify.css";

const Signup = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [passagain, setPassagain] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const Nav = useNavigate();

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmPasswordError("");
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

  
    let passwordValidationError = validatePassword(pass,passagain);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
     
      return;
    }

    
   

    try {
      const response = await axios.post(SignupUrl, {
        firstName: fname,
        lastName: lname,
        email: email,
        password: pass,
      });

      const data = response.data;
      console.log(data);
      Nav("/Login");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Signup failed: " + error.response.data.msg, {
          position: "bottom-left",
          theme: "colored",
        });
      } else {
        console.error("ERROR!", error);
      }
    }
  };

  const handleblur = (e) => {
    setEmail(e.target.value);
    if (e.target.value === "") {
      setEmailError("");
    }
  };

  const handleblurPass = (e) => {
    setPass(e.target.value);
    if (e.target.value === "") {
      setPasswordError("");
    }
  };

  const handleblurPass1 = (e) => {
    setPassagain(e.target.value);
    if (e.target.value === "") {
      setConfirmPasswordError("");
    }
  };

  return (
    <div className="Signup">
      <h1>
        Pa<span>lito.</span>
      </h1>

      <div className="Container-Signup">
        <form onSubmit={HandleSubmit}>
          <div className="Size">
            <h2>Register Now</h2>
            <p>Create your account to proceed</p>
          </div>

          <div className="NameFields">
            <div className="NameField">
              <p>First Name</p>
      
              <input
                placeholder="John"
                onChange={(e) => setFname(e.target.value)}
                required
              />
            </div>
            <div className="NameField">
              <p>Last Name</p>
              <input
                placeholder="Doe"
                onChange={(e) => setLname(e.target.value)}
                required
              />
            </div>
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

          <p>Password</p>
          <input
            placeholder="**************"
            onChange={(e) => setPass(e.target.value)}
            required
            type="password"
            onBlur={handleblurPass}
          />
          {passwordError && (
            <div className="ErrorMessage">
              <p>{passwordError}</p>
            </div>
          )}

          <p>Confirm Password</p>
          <input
            placeholder="**************"
            onChange={(e) => setPassagain(e.target.value)}
            type="password"
            required
            onBlur={handleblurPass1}
          />
          {confirmPasswordError && (
            <div className="ErrorMessage">
              <p>{confirmPasswordError}</p>
            </div>
          )}

          <div className="CheckboxContainer">
            <input type="checkbox" id="terms" required />
            <div className="CheckboxLinks">
              I have read and agreed to the
              <Link to="/privacy-policy" className="Link1">Private Policy</Link>
              and
              <Link to="/terms" className="Link1">Terms & Conditions</Link>
            </div>
          </div>
          <br />
          <button>Create my Account</button>
          <div className="Link">
            Have an account? <Link className="Link-1" to="/Login">Login now</Link>
          </div>
        </form>
      </div>
      <ToastContainer toastStyle={{ backgroundColor: "red" }} />
    </div>
  );
};

export default Signup;
