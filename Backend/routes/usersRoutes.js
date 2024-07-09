const express = require("express");
const usersController = require("../controller/usersController");
const router = express.Router();
const app = express();


router.route("/signup").post(usersController.createUser);
router.route("/logOut").post(usersController.logoutUser);
router.route("/signin").post(usersController.Signin);
router.route("/authenticatedToken").get(usersController.authenticatedRoute)
router.route("/AddPDF").post(usersController.AddPDF)
router.route("/AddPrime").patch(usersController.AddPrime)
router.route("/edit/:id").post(usersController.editUserById)
router.route("/all").get(usersController.getAllUsers);
router.use(usersController.middelChecker)
router.route("/GetByID").get(usersController.getUserById);
router.route("/all").delete(usersController.deleteAllUsers)
router.route("/DeleteByID/:id").delete(usersController.deleteById);
router.route("/sendUserCv").get(usersController.sendUserCv);
module.exports = router;