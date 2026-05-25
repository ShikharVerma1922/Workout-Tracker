import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { getAllExercises } from "../services/exercise.service.js";

export const getExercises = asyncHandler(async (req, res) => {
  const exercises = await getAllExercises();

  return res
    .status(200)
    .json(new ApiResponse(200, exercises, "Exercises fetched successfully"));
});
