import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  plans: defineTable({
    userId: v.string(),
    name: v.string(),
    workoutPlan: v.object({
      schedule: v.array(v.string()),
      exercises: v.array(
        v.object({
          day: v.string(),
          routines: v.array(
            v.object({
              name: v.string(),
              sets: v.optional(v.number()),
              reps: v.optional(v.number()),
              duration: v.optional(v.number()),
              description: v.optional(v.string()),
              exercises: v.optional(v.array(v.string())),
            })
          ),
        })
      ),
    }),
    dietPlan: v.object({
      dailyCalories: v.number(),
      meals: v.array(
        v.object({
          name: v.string(),
          foods: v.array(v.string()),
          protein: v.array(v.number()),
        })
      ),
    }),
    isActive: v.boolean(),
  })
    .index("by_user_id", ["userId"])
    .index("by_active", ["isActive"]),

  customRoutines: defineTable({
    userId: v.string(),
    exerciseId: v.string(),
    name: v.string(),
    type: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  routines: defineTable({
    userId: v.string(),
    date: v.string(),
    pushups: v.number(),
    weightlifts: v.number(),
    cardio: v.number(),
    runningTime: v.optional(v.number()),
    runningDistance: v.optional(v.number()),
    cyclingTime: v.optional(v.number()),
    cyclingDistance: v.optional(v.number()),
    custom: v.number(),
    volume: v.optional(v.number()),
    crunches: v.optional(v.number()),
    squats: v.optional(v.number()),

    // Detailed Set-wise Tracking
    pushupSetsDetail: v.optional(v.array(v.object({ reps: v.number(), type: v.string() }))),
    weightliftSetsDetail: v.optional(v.array(v.object({ reps: v.number(), weight: v.optional(v.string()), type: v.string() }))),
    cardioSetsDetail: v.optional(v.array(v.object({ cardioType: v.string(), reps: v.number(), distance: v.optional(v.string()) }))),
    crunchesSetsDetail: v.optional(v.array(v.object({ reps: v.number(), type: v.string() }))),
    squatsSetsDetail: v.optional(v.array(v.object({ reps: v.number(), type: v.string() }))),
    customSetsDetail: v.optional(
      v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          type: v.string(),
          sets: v.array(v.object({ reps: v.number(), weight: v.optional(v.string()), type: v.string() }))
        })
      )
    ),

    logCount: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"]),
});
