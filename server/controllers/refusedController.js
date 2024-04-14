const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getReason = async (req, res) => {
  const { email } = req.body;
  const refuseReason = await User.findOne({ email: email }).select(
    "refuseReason"
  );
  res.json(refuseReason);
};

const verifyRefusedSession = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (token) {
      const user = jwt.verify(token, process.env.JWT_SECRET, {});
      if (user.status == "Refused") {
        next();
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else return res.status(401).json({ error: "Unauthorized" });
  } catch (error) {
    console.log("Error in verifyRefusedSession: ", error);

    return res.status(500).json({
      error: "verify 'Refused' session error, please try again later.",
    });
  }
};

const sendImage = async (req, res) => {
  const { email } = req.body;
  const file = req.file;
  try {
    await User.updateOne(
      { email },
      {
        $set: {
          status: "Pending",
          imagePath: file.filename,
        },
      }
    );
    res.json({ message: "Image saved successfully" });
  } catch (error) {
    console.log("Error in sendImage: ", error);
    return res.status(500).json({
      error: "Server can't process the image now, please try again later.",
    });
  }
};

module.exports = {
  getReason,
  verifyRefusedSession,
  sendImage,
};
