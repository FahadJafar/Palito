import React, { useState, useEffect, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import "../css/Setting.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Toastify.css";
import "bootstrap/dist/css/bootstrap.css";
import CameraAltIcon from "@mui/icons-material/CameraAlt"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../Context/UserContext"; // Import the AppContext

const Setting = ({ onEmailEdit, onPassEdit }) => {
  const { userData, setUserData } = useContext(AppContext); // Destructure userData from context
  const { fname, lname, email } = userData; // Get user data from context
  const [nameisTrue, setnameisTrue] = useState(true);
  const [Fname, setFname] = useState(fname);
  const [Lname, setLname] = useState(lname);
  const [image, setImage] = useState(null);
  const Nav = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://palito-backend1.vercel.app/api/auth/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          }
        });
        
        const profileImagePath = response.data.profileImage;
        setImage(profileImagePath || "../Img/pro.jpg"); // Set default image if none provided
        setFname(response.data.firstName); // Set first name
        setLname(response.data.lastName); // Set last name
        setUserData(prevState => ({ ...prevState, fname: response.data.firstName, lname: response.data.lastName })); // Update context
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data.");
      }
    };
    
    fetchUserData();
  }, [setUserData]); // Dependency array updated

  const handleNameToggle = () => {
    setnameisTrue(!nameisTrue);
  };

  const handleClick = () => {
    localStorage.removeItem("showSettings");
    Nav("/Home");
  };

  const handleNameChange = async () => {
    if (Fname === "" || Lname === "") {
      toast.error("Both first name and last name are required.");
      return;
    }

    try {
      const response = await axios.post("https://palito-backend1.vercel.app/api/auth/update", {
        firstName: Fname,
        lastName: Lname,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        }
      });

      setUserData(prevState => ({ ...prevState, fname: Fname, lname: Lname })); // Update context
      toast.success(response.data.msg);
      setnameisTrue(true);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error updating name");
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post("https://palito-backend1.vercel.app/api/auth/uploadImage", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        setImage(response.data.imageUrl); 
        setUserData(prevState => ({ ...prevState, profileImage: response.data.imageUrl })); // Update context
        toast.success("Image uploaded successfully");
      } catch (error) {
        toast.error("Error uploading image");
      }
    }
  };

  const handleImageRemove = async () => {
    try {
      await axios.delete("https://palito-backend1.vercel.app/api/auth/deleteImage", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setImage(null);
      setUserData(prevState => ({ ...prevState, profileImage: null })); // Update context
      toast.success("Avatar removed");
    } catch (error) {
      toast.error("Error removing image");
    }
  };

  const handleIconClick = () => {
    document.getElementById("fileInput").click(); 
  };

  return (
    <div className="Setting">
      <div className="Adjust">
        <h2>
          <h1 onClick={handleClick}>
            <KeyboardBackspaceIcon className="IconArrow" />
            Back to patents
          </h1>
          Setting
        </h2>
      </div>
      <div className="Setting-Container">
        <h4>Personal Information</h4>
        <div className="Avatar-container">
          <Avatar
            alt="Profile Image"
            className="Avatar-img"
            sx={{ width: 135, height: 135 }}
            src={image || "../Img/pro.jpg"}
          />
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleImageUpload}
            className="upload-button"
            style={{ display: 'none' }} // Hide the default file input
          />
          <div className="image-icon" onClick={handleIconClick}>
            <CameraAltIcon style={{ color: "white" }} />
          </div>
          <button onClick={handleImageRemove} className="remove-button">
            Remove Avatar
          </button>
        </div>
        <div className="NAME">
          {nameisTrue ? (
            <>
              <div className="NAME-content">
                <h3>Name</h3>
                <p>
                  {fname} {lname}
                </p>
              </div>
              <div className="setting-btn">
                <button onClick={handleNameToggle}>Edit</button>
              </div>
            </>
          ) : (
            <div className="Cname">
              <div className="Cname-labels">
                <h2>First Name</h2>
                <h2>Last Name</h2>
              </div>
              <div className="Cname-inputs">
                <input
                  value={Fname}
                  onChange={(e) => setFname(e.target.value)}
                />
                <input
                  value={Lname}
                  onChange={(e) => setLname(e.target.value)}
                />
              </div>
              <div className="Cname-button">
                <button onClick={handleNameChange}>Change Name</button>
                <button onClick={handleNameToggle}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <div className="EMAIL">
          <div className="NAME-content">
            <h3>Email</h3>
            <p>{email}</p>
          </div>
          <div className="setting-btn">
            <button onClick={onEmailEdit}>Edit</button>
          </div>
        </div>

        <div className="Pass">
          <div className="NAME-content">
            <h3>Change Password</h3>
          </div>
          <div className="setting-btn">
            <ArrowForwardIosOutlinedIcon
              onClick={onPassEdit}
              className="Icon"
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Setting;
