const Users = require("../models/usersModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { findById } = require("../models/usersModel");
const { findByIdAndUpdate } = require("../models/usersModel");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const secret = process.env.SECRET



exports.createUser = async (req, res) => {
  try {
    console.log("hi");
    const answer = await doesUsernameExist(req.body.username);
    if (!answer) {
      const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
      const newUsers = await Users.create({
        ...req.body,
        password: hashPassword,
      });
      console.log(newUsers._id);
      const token = jwt.sign({ _id: newUsers._id }, secret, {
        expiresIn: "24h",
      });
      res.cookie("token", token, {
        // httpsOnly: true,
        httpOnly: true,
        maxAge: 360000,
        samSite: "strict",
        secure:'production'
      });
      const {email,role,username,cvs}=newUsers
      
      return res.send({email:email,role:role,username:username,cvs:cvs});
    } else {
      return res.status(401).send({error:"User already exists"});
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
};

exports.middelChecker = async (req, res, next) => {
  try {
    if (!req.cookies.token) {
      return res
        .status(401)
        .json({ massage: "No token provided", authorize: false });
    }
    const token = req.cookies.token;

    const decoded = jwt.verify(token, secret);

    const userData = await Users.findById(decoded._id);
    req.user = userData;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ massage: error.massage || "An error middelChecker " });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user=req.user
    console.log(user);
    
    if (!user) {
      return res.status(404).send("User not found");
    }
    const {role,cvs,username,email}=user

    res.status(200).json({role,username,cvs,email});
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const UsersArray = await Users.find().populate("cvs");
    res.send(UsersArray);
  } catch (error) {
    console.error("Error fetching all Users:", error);
    res.status(500).send("Internal Server Error");
  }
};
exports.Signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Users.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ _id: user._id }, secret, {
        expiresIn: "24h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 360000,
        samSite: "strict",
      });
      res.status(200).send({
        massage: "Logged in successfully",
        userRole: user.role,
        success: true,
      });
    } else {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "fail",
      massage: "An error occurred during login",
    });
  }
};

exports.deleteAllUsers = async (req, res) => {
  Users.collection
    .drop()
    .then(() => {
      res.send("Users collection dropped");
    })
    .catch((error) => {
      res.send("Error dropping Users collection:", error);
    });
};
exports.editUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Users.findByIdAndUpdate(id, {
      username: req.body?.username,
      password: req.body?.password,
      email: req.body?.email,
    });

    if (result) {
      res.send("User edited successfully.");
    } else {
      res.send("User not found or not edited.");
    }
  } catch (error) {
    console.error("Error editing User:", error);
    res.status(500).send("Internal Server Error");
  }
};
exports.deleteById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Users.deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      res.send("User deleted successfully.");
      return;
    } else {
      res.send("User not found or not deleted.");
      return;
    }
  } catch (error) {
    console.error("Error deleting User:", error);
    res.status(500).send("Internal Server Error");
  }
};

async function doesUsernameExist(username) {
  try {
    const existingUser = await Users.findOne({ username });
    if (existingUser) {
      console.log(existingUser);
      return existingUser;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking name existence:", error);
    return false;
  }
}
exports.authenticatedRoute = async (req, res, next) => {
  try {

    if (!req.cookies.token) {
      return res
        .status(401)
        .json({ massage: "No token provided", authorize: false });
    }

    const token = req.cookies.token;

    const decoded = jwt.verify(token, secret);
   

    const userData = await Users.findById(decoded._id);
    console.log(userData);
    req.user = userData;
    switch (userData.role) {
      case "prime":
        res.status(200).json({ authorize: true });
        break;
      case "gest":
        res.status(201).json({ authorize: false });
        break;
      case "admin":
        res.status(200).json({ authorize: true });
        break;

      default:
        res.status(201).json({ authorize: false });
        break;
    }
  } catch (error) {
    res.status(500).json({ massage: error.massage || "An error occurred " });
  }
};

exports.AddPrime = async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log(req.cookies)
    

    if (!token) {
      return res.status(401).json({ massage: "No token provided" });
    }
    const decoded = jwt.verify(token, secret);
    console.log(decoded._id);
    const userUpdate = await Users.findByIdAndUpdate(
      decoded._id,
      { role: "prime" },
      { new: true }
    );
    console.log(userUpdate);
    res.status(200).json({ massage: "user updated " });
  } catch (error) {
    res.status(500).json({ massage: error.massage || "An error occurred " });
  }
};
exports.singOut = (req, res) => {
  try {
    res.cookies("token", "", {
      httpOnly: true,
      expires: new Date(0),
      samSite: "strict",
    });
    res.status(200).send({ massage: "Logged out successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const CV = require("../models/cvModel");

exports.AddPDF = async (req, res) => {
  try {
    const PDF = req.body;
    const token = req.cookies.token;
    if (!token) {
      

      return res.status(401).json({ massage: "No token provided" });
    }
    const modlePDF = await CV.create(PDF);
    const decoded = jwt.verify(token, secret);
    const user = await Users.findById(decoded._id);
    user.cvs.push(modlePDF._id);
    await user.save();

    res.status(200).json({ massage: "cv array is updated " });
  } catch (error) {
    res.status(500).json({ massage: error.massage || "Something went wrong " });
  }
};
exports.sendUserCv = async (req, res) => {
  try {
    console.log(req.cookies.token);
    if (!req.cookies.token) {
      return res.status(401).json({ massage: "No token provided" });
    }
    const token = req.cookies.token;

    const decoded = jwt.verify(token, secret);

    const UserCvArray = await Users.findById(decoded._id).populate(
      "cvs",
      
    );

    res.status(200).json({ UserCvArray: UserCvArray.cvs });
  } catch (error) {
    res.status(500).json({ massage: error.massage || "Something went wrong " });
  }
};
exports.logoutUser = (req, res) => {
  try {
    console.log("gi");
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "strict",
    });

    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};


