import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerUser = async (name, email, password) => {
  // 1. Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(400, "Email already in use");
  }

  // 2. Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // 3. Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  return user;
};

export const loginUser = async (email, password) => {
  // 1. Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 2. Verify password
  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  return user;
};
