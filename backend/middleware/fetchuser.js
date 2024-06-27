const jwt = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Please provide valid credentials" });
  }
  try {
    const data = jwt.verify(token.split(' ')[1], process.env.jwt_secret);
    req.user = data.user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired. Please log in again." });
    }
    res.status(500).json({ error: "Internal Server Error" });
    console.log(error);
  }
};

module.exports = fetchuser;
