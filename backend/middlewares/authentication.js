const jwt = require("jsonwebtoken");
const User = require("../models/user")

exports.verifyToken = (req, res, next) => {
  //const token = req.body.token || req.query.token || req.headers["authorization"];
  const { token } = req.cookies
  if (!token) {
    return res.status(403).send({
      message: "Please login to continue"
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } 
  catch (err) {
    if (err.expiredAt && err.expiredAt < new Date()) {
      return res.status(401).send({
        message: "Session expired. Please login again."
      })
    }
    return res.status(401).send({
      message: "Invalid Token"
    });
  }
  return next();
};


// Handling users roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const { token } = req.cookies
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    if (!roles.includes(decoded.role)) {
      return res.status(401).send({
          message: "Access Denied: You dont have correct privilege to perform this operation"
        })
    }
    next()
  }
}


