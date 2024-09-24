import { useContext, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Avatar from "@mui/material/Avatar";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import logo from "../Img/refresh.png";
import logo2 from "../Img/Add.png";
import logo3 from "../Img/simcard-2.png";
import "../css/Navbar.css";
import { AppContext } from "../Context/UserContext"; 
import axios from "axios";
import { ToastContainer } from "react-toastify";

const Navbar = () => {
  const { folders, setFolders, profileImage, fname, lname, email } = useContext(AppContext);
  const [sideBar, setSideBar] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const Nav = useNavigate();
  const token = localStorage.getItem("token");
  const baseURL = "https://palito-backend1.vercel.app/";

  const handleSETTINGS = () => {
    localStorage.setItem("showSettings", "1");
    Nav("/Home"); 
  };
  
  const handleSETTINGS1 = () => {
    localStorage.setItem("showSettings", "0");
    Nav("/Home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    Nav("/Login");
  };

  const toggleSidebar = () => {
    setSideBar(!sideBar);
  };

  const addNewFolder = async () => {
    try {
      const res = await axios.post(
        `${baseURL}api/auth/folders`,
        { name: "New Folder" },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      setFolders((prevFolders) => [...prevFolders, res.data]);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleMenuOpen = (event, folder) => {
    setAnchorEl(event.currentTarget);
    setCurrentFolder(folder);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentFolder(null);
  };

  const handleRename = async () => {
    const newName = prompt("Enter new folder name:", currentFolder.name);
    if (newName) {
      try {
        const res = await axios.put(
          `${baseURL}api/auth/folders/${currentFolder._id}`,
          { name: newName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder._id === currentFolder._id ? { ...folder, name: res.data.name } : folder
          )
        );
      } catch (err) {
        console.error(err.message);
      }
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${baseURL}api/auth/folders/${currentFolder._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFolders((prevFolders) => prevFolders.filter((folder) => folder._id !== currentFolder._id));
    } catch (err) {
      console.error(err.message);
    }
    handleMenuClose();
  };

  return (
    <div className={`Navbar ${sideBar ? "" : "collapsed"}`}>
      <nav>
        <div className="Adjust">
          {sideBar ? (
            <h1 className="Direct" onClick={handleSETTINGS1}>
              Pa<span>lito.</span>
            </h1>
          ) : (
            <h1 className="pointer" onClick={toggleSidebar}>
              P
            </h1>
          )}
          {sideBar && (
            <div className="Menu-icon" onClick={toggleSidebar}>
              <KeyboardDoubleArrowLeftIcon fontSize="large" className="Menu" />
            </div>
          )}
        </div>

        {sideBar ? (
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            placeholder="Search in library"
            className="custom-textfield"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
        ) : (
          <SearchOutlinedIcon className="collapsed-search-icon" onClick={toggleSidebar} />
        )}

        <div className="Bar">
          <Accordion>
            {sideBar && (
              <Accordion.Item eventKey="0" className="accordion-item">
                <Accordion.Header>
                  <img src={logo} alt="logo" />
                  Recent views
                </Accordion.Header>
                <Accordion.Body>View 1</Accordion.Body>
              </Accordion.Item>
            )}
            <div className="Folder">
              {sideBar ? (
                <>
                  <img src={logo2} alt="logo2" />
                  <button onClick={addNewFolder}>Add new folder</button>
                </>
              ) : (
                <img src={logo2} alt="logo2" className="collapsed-icon1" onClick={toggleSidebar} />
              )}
            </div>

            {folders.map((folder, index) =>
              sideBar ? (
                <Accordion.Item eventKey={index + 1} key={folder.id}>
                  <Accordion.Header>
                    <img src={logo3} alt="logo3" />
                    {folder.name}
                    <MoreVertIcon onClick={(e) => handleMenuOpen(e, folder)} className="dots" />
                  </Accordion.Header>
                  <Accordion.Body></Accordion.Body>
                </Accordion.Item>
              ) : (
                <div className="collapsed-Ava" key={folder.id}>
                  <img src={logo3} alt="logo3" onClick={toggleSidebar} />
                </div>
              )
            )}
          </Accordion>
        </div>

        <div className="Logout">
          {sideBar ? (
            <Accordion>
              <Accordion.Header>
                <div className="Profile">
                  <Avatar alt="Profile Image" src={profileImage} />
                  <h2>{fname}</h2>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <p>{fname} {lname}</p>
                <p style={{ fontWeight: 800 }}>{email}</p>
                <p className="pointer" onClick={handleSETTINGS}>Settings</p>
                <div className="btn">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </Accordion.Body>
            </Accordion>
          ) : (
            <Avatar alt="Profile Image" src={profileImage} className="Ava" onClick={toggleSidebar} />
          )}
        </div>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleRename}>
            <DriveFileRenameOutlineIcon /> Rename
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <DeleteOutlineIcon /> Delete
          </MenuItem>
        </Menu>
      </nav>
      <ToastContainer/>
    </div>
  );
};

export default Navbar;
