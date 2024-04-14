const express = require("express");
const router = express.Router();
const { upload } = require("../handlers/fileHandler");
const { getReason, sendImage } = require("../controllers/refusedController");

router.post("/getReason", getReason);
router.post("/sendImage", upload.single("image"), sendImage);
//consolelog
router.use((req, res, next) => {
  console.log("A request is being made to /refused");
  next();
});

module.exports = router;
