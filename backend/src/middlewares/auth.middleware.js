import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
    });

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
};
