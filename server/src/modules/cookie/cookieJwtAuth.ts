import type { RequestHandler } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

type User = {
  id: number;
  email: string;
  user_role: string;
};

const cookieJwtAuth: RequestHandler = (req, res, next) => {
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user as User;
    next();
  } catch (error) {
    res.clearCookie("token");
    res.status(401).json({ message: "Session expirée, veuillez vous reconnecter" });
  }
};

export default { cookieJwtAuth };