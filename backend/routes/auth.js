const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const Folder = require("../models/Folder");
const authMiddleware = require("./middleware");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {
    user: "fahadjaffer123@gmail.com", 
    pass: "qxcqatvwdoxzrlnt", 
  },
});
cloudinary.config({
  cloud_name: "dt5is8c0t",
  api_key: "531397895516732",
  api_secret: "lsxXZJSNqGM-GvE1In7VA--nd1U",
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_images', 
    format: async (req, file) => 'jpg', 
    public_id: (req, file) => Date.now(), 
  },
});

const upload = multer({ storage });

router.delete("/deleteImage", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user || !user.profileImage) {
      return res.status(404).json({ msg: "No profile image found" });
    }

    const publicId = user.profileImage.split('/').pop().split('.')[0]; 

    await cloudinary.uploader.destroy(`profile_images/${publicId}`); 
    await User.updateOne({ _id: userId }, { $unset: { profileImage: "" } });

    res.status(200).json({ msg: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting image" });
  }
});
router.post("/uploadImage", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

   
    user.profileImage = req.file.path; // This contains the Cloudinary URL
    await user.save();

    res.json({ imageUrl: user.profileImage });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.get("/USER", authMiddleware, async (req, res) => {
  try {
   
    const user = await User.findById(req.user.id);
    
  
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    
    res.json({
      profileImage: user.profileImage, //
      firstName: user.firstName || "First Name",
      lastName: user.lastName || "Last Name",
      email: user.email || "email@example.com",
    });
  } catch (err) {
    console.error("Error fetching user data:", err.message);
    res.status(500).send("Server Error");
  }
});


router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl = `https://your-frontend-url.vercel.app/reset-password/${resetToken}`;
    const mailOptions = {
      from: "fahadjaffer123@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please Click the Below Link to Reset Password:\n\n
                   ${resetUrl}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error sending email" });
      }
      res.json({ msg: "Email sent" });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "Password reset token is invalid or has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ msg: "Password has been reset successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ firstName, lastName, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: { id: user.id },
    };

    jwt.sign(payload, config.jwtSecret, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        fname: user.firstName,
        lname: user.lastName,
        Email: user.email,
      },
    };

    jwt.sign(payload, config.jwtSecret, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: payload.user });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/update", authMiddleware, async (req, res) => {
  const { firstName, lastName } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not founDD" });
    }

    user.firstName = firstName;
    user.lastName = lastName;

    await user.save();

    res.json({
      msg: "Name updated successfully",
      user: { firstName: user.firstName, lastName: user.lastName },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/updateEmail", authMiddleware, async (req, res) => {
  const { newEmail, password } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const oldEmail = user.email;
    user.email = newEmail;
    await user.save();

    const mailOptions = {
      from: "fahadjaffer123@gmail.com",
      to: oldEmail,
      subject: "Email Address Updated",
      text: `Your email address has been updated to ${newEmail}. If you did not make this change, please contact support immediately.`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error sending email" });
      }
      res.json({ msg: "Email updated successfully" });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/changePassword", authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect old password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});
//===============================FOLDERS API BELOW===============================

router.post("/folders", authMiddleware, async (req, res) => {
  //FOR ADDING FOLDER IN DB
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const newFolder = new Folder({ name, userId });
    await newFolder.save();
    res.json(newFolder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/folders", authMiddleware, async (req, res) => {
  // FOR GETTING ALL FOLDERS
  const userId = req.user.id;

  try {
    const folders = await Folder.find({ userId });
    res.json(folders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/folders/:id", authMiddleware, async (req, res) => {
  //For Renaming FOLDER
  const { name } = req.body;
  const folderId = req.params.id;

  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ msg: "Folder not found" });
    }

    folder.name = name;
    await folder.save();
    res.json(folder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/folders/:id", authMiddleware, async (req, res) => {
  //FOR DELETING ALL FOLDERS
  const folderId = req.params.id;

  try {
    await Folder.findByIdAndDelete(folderId);
    res.json({ msg: "Folder deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.get("/", (req, res) => {
  res.send("Welcome to Fahad Jafars Palito Backend");
});

module.exports = router;
