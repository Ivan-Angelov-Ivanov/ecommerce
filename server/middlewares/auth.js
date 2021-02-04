const admin = require("../firebase");
const user = require("../models/user");

exports.authCheck = async (req, res, next) => {
  //console.log(req.headers); // token
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    //console.log("Firebase User in AuthCheck", firebaseUser);
    req.user = firebaseUser;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};

exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;

  const adminUser = await user.findOne({ email }).exec();

  if (adminUser.role !== "admin") {
    res.status(403).json({
      error: "Admin resource. Access denied.",
    });
  } else {
    next();
  }
};
