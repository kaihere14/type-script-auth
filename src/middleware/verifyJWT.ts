import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";



interface UserRequest extends Request {
  user?: string;
}

export const verifyJWT = async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : undefined;

    if (!accessToken) {
      return res.status(401).json({ statusCode: 401, message: "Access token missing" });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY as Secret) as JwtPayload;
    if (!decoded.id) {
      return res.status(401).json({ statusCode: 401, message: "Invalid token payload" });
    }

    req.user = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ statusCode: 403, message: "Invalid or expired token" });
  }
};
