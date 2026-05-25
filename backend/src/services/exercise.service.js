import { prisma } from "../lib/prisma.js";

export const getAllExercises = async () => {
  const exercises = await prisma.exercise.findMany({
    orderBy: [{ muscleGroup: "asc" }, { name: "asc" }],
  });
  return exercises;
};
