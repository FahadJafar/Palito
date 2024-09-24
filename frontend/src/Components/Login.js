import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginUrl } from "../API/urls";
import { validateEmail } from "./validate";
import "../css/Login.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Toastify.css";
import { AppContext } from "../Context/UserContext"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [emailError, setEmailError] = useState("");
  const Nav = useNavigate();

  // Access the context values
  const { setFname, setLname, setEmail: setContextEmail } = useContext(AppContext);

  const obj = {
    email: email,
    password: pass,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    try {
      const response = await axios.post(LoginUrl, obj);

      // Save to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("fname", response.data.user.fname);
      localStorage.setItem("lname", response.data.user.lname);
      localStorage.setItem("email", email);

      // Update context with user's details
      setFname(response.data.user.fname);
      setLname(response.data.user.lname);
      setContextEmail(email);

      // Success toast and navigation
      toast.success("Login Successful!");
      localStorage.setItem("showSettings", "0");
      Nav("/Home", { state: { msg: "Login Successful!" } });
    } catch (error) {
      console.error("There was an error!!", error);
      toast.error("Login failed: " + error.response.data.msg, {
        position: "bottom-left",
        theme: "colored",
      });
    }
  };

  const handleBlur = (e) => {
    setEmail(e.target.value);
    if (e.target.value === "") {
      setEmailError("");
    }
  };

  return (
    <div className="Home">
      <h1>
        Pa<span>lito.</span>
      </h1>
      <div className="Container1">
        <form onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          <br />
          <p>Email address</p>
          <input
            placeholder="samplemail@mail.com"
            onChange={(e) => setEmail(e.target.value)}
            required
            onBlur={handleBlur}
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
            type="Password"
          />
          <div className="CheckboxContainer1">
            <div>
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe" className="CheckboxLabel1">
                Remember Me
              </label>
            </div>
            <Link to="/Reset">Forget Password?</Link>
          </div>
          <button>Login</button>
          <div className="Link2">
            New to Here? <Link className="Link-1" to="/Signup">Register Now</Link>
          </div>
        </form>
      </div>
      <ToastContainer toastStyle={{ backgroundColor: "red" }} />
    </div>
  );
};

export default Login;
