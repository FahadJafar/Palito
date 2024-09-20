import "../css/Reset.css";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { validatePassword1 } from "./validate";
import axios from "axios";

const ResetPass = () => {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { token } = useParams();
  const Nav = useNavigate();



  const handlesubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword1(pass);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password: pass }
      );

      setSuccess(response.data.msg);
      setError("");
      setTimeout(() => {
        Nav('/Login');
      }, 2000);

    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.msg);
      } else {
        console.error("There was an error!", error);
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="Reset">
      <div className="Edit">
        <h1>
          Pa<span>lito</span>
        </h1>
      </div>
      <div className="Reset-Container">
        <form onSubmit={handlesubmit}>
          <h2>Change Password</h2>
          {error && <div className="ErrorMessage">{error}</div>}
          {success && <div className="SuccessMessage">{success}</div>}
          <p>New Password</p>
          <input
            placeholder="Password"
            type="password"
            onChange={(e) => setPass(e.target.value)}
            required
          />
          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPass;
