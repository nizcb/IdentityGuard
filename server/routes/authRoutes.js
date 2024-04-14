const express = require("express");
const router = express.Router();
const { upload } = require("../handlers/fileHandler");
const {
  test,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
} = require("../controllers/authController");

router.get("/", test);
router.post(
  "/register",
  upload.single("image"),
  require("../middlewares/toLowerCase"),
  registerUser
);
router.post("/login", loginUser);
router.get("/Profile", getProfile);
router.get("/logout", logoutUser);

module.exports = router;
