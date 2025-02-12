const jwt = require("jsonwebtoken");

const verifyRole = (roles) => {
  return (req, res, next) => {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access Denied" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
};

export default verifyRole;
