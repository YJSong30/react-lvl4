import jwt from "jsonwebtoken";

const JWT_SECRET =
  "d6bc6d9a1dec3427d744d6fe045b2cfaab1b8acadcc871cfd8e523ab1e67c24b";
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    // (err, user) is callback. user = "decoded"
    if (err) {
      return res.status(403).json({ error: "invalid or expired token" });
    }
    req.user = user; // add user to the request
    next();
  });
};
