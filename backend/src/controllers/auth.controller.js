import {
  registerUser,
  loginUser,
  generateToken,
} from "../services/auth.service.js";
import { cookieOptions } from "../utils/cookieOptions.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    [name, email, password].some((field) => String(field).trim() === "")
  )
    throw new ApiError(400, "All fields are required");

  // Call the service
  const user = await registerUser(name, email, password);
  const token = generateToken(user.id);

  // Format and send the HTTP response (The Waiter)
  return res
    .status(201)
    .cookie("token", token, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            preferredUnit: user.preferredUnit,
          },
        },
        "User registered successfully",
      ),
    );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please provide an email and password");
  }

  // Call the service
  const user = await loginUser(email, password);
  const token = generateToken(user.id);

  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            preferredUnit: user.preferredUnit,
          },
        },
        "Logged in successfully",
      ),
    );
});

export const logout = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("token", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});
