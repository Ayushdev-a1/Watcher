const jwt = require('jsonwebtoken');
const jwt_secret = "wehdhh";

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({ error: "Please provide valid credentials" });
  }

  try {
    const data = jwt.verify(token, jwt_secret);
    req.user = data.user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired. Please log in again." });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = fetchuser;