import { prisma } from "../src/lib/prisma.js";

const exercises = [
  // Chest
  { name: "Barbell Bench Press", muscleGroup: "Chest", equipment: "Barbell" },
  {
    name: "Incline Dumbbell Press",
    muscleGroup: "Chest",
    equipment: "Dumbbell",
  },
  { name: "Cable Crossover", muscleGroup: "Chest", equipment: "Cable" },

  // Back
  { name: "Deadlift", muscleGroup: "Back", equipment: "Barbell" },
  { name: "Pull Up", muscleGroup: "Back", equipment: "Bodyweight" },
  { name: "Lat Pulldown", muscleGroup: "Back", equipment: "Machine" },
  { name: "Barbell Row", muscleGroup: "Back", equipment: "Barbell" },

  // Legs
  { name: "Barbell Squat", muscleGroup: "Legs", equipment: "Barbell" },
  { name: "Leg Press", muscleGroup: "Legs", equipment: "Machine" },
  { name: "Romanian Deadlift", muscleGroup: "Legs", equipment: "Barbell" },
  { name: "Calf Raise", muscleGroup: "Legs", equipment: "Machine" },

  // Shoulders
  { name: "Overhead Press", muscleGroup: "Shoulders", equipment: "Barbell" },
  { name: "Lateral Raise", muscleGroup: "Shoulders", equipment: "Dumbbell" },
  { name: "Face Pull", muscleGroup: "Shoulders", equipment: "Cable" },

  // Arms
  { name: "Bicep Curl", muscleGroup: "Arms", equipment: "Dumbbell" },
  { name: "Tricep Pushdown", muscleGroup: "Arms", equipment: "Cable" },
  { name: "Hammer Curl", muscleGroup: "Arms", equipment: "Dumbbell" },

  // Core
  {
    name: "Crunch",
    muscleGroup: "Core",
    equipment: "Bodyweight",
    isBodyWeight: true,
  },
  {
    name: "Plank",
    muscleGroup: "Core",
    equipment: "Bodyweight",
    isBodyWeight: true,
  },
];

async function main() {
  console.log("🌱 Starting database seeding...");

  for (const ex of exercises) {
    // Upsert checks if the exercise exists (by a unique field, usually 'name')
    // If it doesn't exist, it creates it. If it does, it updates it.
    const createdExercise = await prisma.exercise.upsert({
      where: { name: ex.name },
      update: {},
      create: ex,
    });
    console.log(`✅ Synced: ${createdExercise.name}`);
  }

  console.log("🌲 Seeding finished successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:");
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
