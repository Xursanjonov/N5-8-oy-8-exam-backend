const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const Routes = require("./routers/index.js");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB is connected"))
  .catch(() => console.log("MongoDB is not connected"));

app.use("/", Routes);
app.get("/", (req, res)=>{
  res.json("hello world")
})
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("./files"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`${PORT} has been listening`));
