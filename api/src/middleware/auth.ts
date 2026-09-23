import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../security.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    const err = new Error("No token provided") as Error & { status: number };
    err.status = 401;
    return next(err);
  }

  try {
    const payload = verifyToken(token);
    if (typeof payload === "string" || typeof (payload as JwtPayload).id !== "number") {
      const err = new Error("Invalid token payload") as Error & { status: number };
      err.status = 401;
      return next(err);
    }
    req.userId = (payload as JwtPayload).id as number;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
      const err = new Error("Invalid or expired token") as Error & { status: number };
      err.status = 401;
      return next(err);
    }
    next(error);
  }
}