const express = require("express");
const UserCvRouts=require('./routes/UserCvRoutes')
const app = express();
const usersController=require('./controller/usersController')
const userRoutes = require("./routes/usersRoutes");
module.exports = app;
app.use(express.json());
const cookieParser=require("cookie-parser")
const corsOptions = {
  origin: ["https://cvproject-1.onrender.com",'http://localhost:5173'],
  credentials: true,
};
const cors = require("cors");
app.use(cookieParser())
app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.send("Hi!");
});
// need to setup rout shit

app.use("/users", userRoutes);

app.use("/UserCv",UserCvRouts)
app.all("*", (req, res) => {
  res.status(404).send(`Can't find ${req.originalUrl} on this server!`);
});
