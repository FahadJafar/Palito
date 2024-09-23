const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");
const authRoutes = require("./routes/auth");
const path = require("path");

const app = express();

app.use(express.json());

const corsOptions = {
  origin: 'https://palito.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));


app.get("/", (req, res) => {
  res.send("Welcome to Fahad Jafars Palito Backend");
});


app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server started on port", PORT));
