const express = require("express");
const router = express.Router();
const { dir } = require("../handlers/fileHandler");
const {
  getUsersInfo,
  acceptUser,
  refuseUser,
} = require("../controllers/adminController");

//admin
router.get("/usersInfo", getUsersInfo);
router.use("/uploads", express.static(dir));
router.post("/accept", acceptUser);
router.post("/refuse", refuseUser);

module.exports = router;
