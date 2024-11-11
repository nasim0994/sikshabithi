const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const {
  registerUser,
  processRegister,
  loginUser,
  getMe,
  forgotPassword,
  recoverPassword,
  getAll,
  gettAllUsers,
  downloadHandnote,
} = require("../controllers/userController");

router.get("/all", getAll);
router.get("/all/user", gettAllUsers);
router.post("/processRegister", processRegister);
router.get("/verify/:token", registerUser);
router.post("/login", loginUser);
router.post("/forgotPassword", forgotPassword);
router.post("/recoverPassword", recoverPassword);
router.get("/loggedUser", verifyToken, getMe);

router.put("/download/handnote", verifyToken, downloadHandnote);

module.exports = router;
