const express = require("express");

const usersCvController = require("../controller/cvUserController");
const router = express.Router();
const app = express();
router.route('/deleteUserCv').patch(usersCvController.deleteUserCv)
module.exports=router