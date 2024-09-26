const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    //! Validate toke must be present
    if (!token) {
      return res
        .status(400)
        .json({ status: false, message: "Token must be present" });
    }
    // console.log(token);
    const verifyToken = jwt.verify(token, "Secret Key", (err, decoded) => {
      if (err) {
        return false;
      } else {
        return decoded;
      }
    });
    if (verifyToken) {
      req.userId = verifyToken.id;
      next();
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Invalid token. Please login again" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = isAuthenticated;
