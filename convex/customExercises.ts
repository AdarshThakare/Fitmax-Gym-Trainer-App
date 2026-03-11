import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTrackedExercises = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("customRoutines")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const addTrackedExercise = mutation({
  args: {
    userId: v.string(),
    exerciseId: v.string(),
    name: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    // Determine if it already exists to prevent duplicate category cards
    const existing = await ctx.db
      .query("customRoutines")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("exerciseId"), args.exerciseId))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("customRoutines", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const removeTrackedExercise = mutation({
  args: {
    userId: v.string(),
    trackedId: v.id("customRoutines"),
    exerciseId: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Delete from tracked exercises list forever
    await ctx.db.delete(args.trackedId);

    // 2. Cascade Delete: Query all history routines looking for this custom exercise matching `exerciseId`
    const userRoutines = await ctx.db
      .query("routines")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const routine of userRoutines) {
      if (!routine.customSetsDetail || routine.customSetsDetail.length === 0) continue;

      const exerciseIndex = routine.customSetsDetail.findIndex(ex => ex.id === args.exerciseId);

      if (exerciseIndex !== -1) {
        const deletedExercise = routine.customSetsDetail[exerciseIndex];

        // Calculate the total reps/duration of the removed exercise so we subtract it from the routine's overall `custom` volume
        const repsToDeduct = deletedExercise.sets.reduce((sum, set) => sum + set.reps, 0);

        const newCustomSetsDetail = [...routine.customSetsDetail];
        newCustomSetsDetail.splice(exerciseIndex, 1);

        // Mutate the parent routine stripping the metrics entirely
        await ctx.db.patch(routine._id, {
          customSetsDetail: newCustomSetsDetail,
          custom: Math.max(0, routine.custom - repsToDeduct)
        });
      }
    }

    return true;
  },
});
