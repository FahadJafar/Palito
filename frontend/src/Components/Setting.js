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
import { AppContext } from "../Context/UserContext";

const Setting = ({ onEmailEdit, onPassEdit }) => {
  const {
    fname: contextFname,
    lname: contextLname,
    email: contextEmail,
    setFname,
    setLname,
    setProfileImage,
  } = useContext(AppContext); // Destructure context values and setters
  const [nameisTrue, setNameIsTrue] = useState(true);
  const [Fname, setFnameState] = useState(contextFname || "");
  const [Lname, setLnameState] = useState(contextLname || "");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://palito-backend1.vercel.app/api/auth/user", {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}` 
          }
        });
        
        const profileImagePath = response.data.profileImage;
        setImage(profileImagePath || "../Img/pro.jpg");
        setFnameState(response.data.firstName);
        setLnameState(response.data.lastName);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data.");
      }
    };
    
    fetchUserData();
  }, []);

  const handleNameToggle = () => {
    setNameIsTrue(!nameisTrue);
  };

  const handleBlur = (e) => {
    if (e.target.value === "") {
      setNameIsTrue(!nameisTrue);
    }
  };

  const handleClick = () => {
    localStorage.removeItem("showSettings");
    navigate("/Home");
  };

  const handleNameChange = async () => {
    if (Fname === "" || Lname === "") {
      toast.error("Both first name and last name are required.");
      return;
    }

    try {
      const response = await axios.post("https://palito-backend1.vercel.app/api/auth/update", {
        firstName: Fname,
        lastName: Lname
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}` 
        }
      });

      // Update context values
      setFname(Fname);
      setLname(Lname);
      setProfileImage(response.data.profileImage); // Assuming the backend sends the updated profile image

      // Update local storage
      localStorage.setItem("fname", Fname);
      localStorage.setItem("lname", Lname);
      toast.success(response.data.msg);
      setNameIsTrue(true);
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
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        setImage(response.data.imageUrl); 
        setProfileImage(response.data.imageUrl); // Update context with the new image
        localStorage.setItem("profileImage", response.data.imageUrl);
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
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });

      setImage(null);
      setProfileImage(null); // Update context to remove the image
      localStorage.removeItem("profileImage");
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
                  {contextFname} {contextLname}
                </p>
              </div>
              <div className="setting-btn">
                <button onClick={handleNameToggle}>Edit</button>
              </div>
            </>
          ) : (
            <>
              <div className="Cname">
                <div className="Cname-labels">
                  <h2>First Name</h2>
                  <h2>Last Name</h2>
                </div>
                <div className="Cname-inputs">
                  <input
                    placeholder={contextFname}
                    onBlur={handleBlur}
                    onChange={(e) => setFnameState(e.target.value)}
                  />
                  <input
                    placeholder={contextLname}
                    onChange={(e) => setLnameState(e.target.value)}
                  />
                </div>
                <div className="Cname-button">
                  <button onClick={handleNameChange}>Change Name</button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="EMAIL">
          <div className="NAME-content">
            <h3>Email</h3>
            <p>{contextEmail}</p>
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
