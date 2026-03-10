import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveRoutine = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existingRoutine = await ctx.db
      .query("routines")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId).eq("date", args.date))
      .first();

    if (existingRoutine) {
      // Concatenate custom exercises if they share the same ID, or add new ones
      const mergedCustomSets = [...(existingRoutine.customSetsDetail || [])];
      for (const customEx of (args.customSetsDetail || [])) {
        const existingExIndex = mergedCustomSets.findIndex(e => e.id === customEx.id);
        if (existingExIndex !== -1) {
          mergedCustomSets[existingExIndex].sets = [...mergedCustomSets[existingExIndex].sets, ...customEx.sets];
        } else {
          mergedCustomSets.push(customEx);
        }
      }

      await ctx.db.patch(existingRoutine._id, {
        pushups: existingRoutine.pushups + args.pushups,
        weightlifts: existingRoutine.weightlifts + args.weightlifts,
        cardio: existingRoutine.cardio + args.cardio,
        runningTime: (existingRoutine.runningTime || 0) + (args.runningTime || 0),
        runningDistance: (existingRoutine.runningDistance || 0) + (args.runningDistance || 0),
        cyclingTime: (existingRoutine.cyclingTime || 0) + (args.cyclingTime || 0),
        cyclingDistance: (existingRoutine.cyclingDistance || 0) + (args.cyclingDistance || 0),
        custom: existingRoutine.custom + args.custom,
        crunches: (existingRoutine.crunches || 0) + (args.crunches || 0),
        squats: (existingRoutine.squats || 0) + (args.squats || 0),
        logCount: (existingRoutine.logCount || 1) + 1,

        // Append details
        pushupSetsDetail: [...(existingRoutine.pushupSetsDetail || []), ...(args.pushupSetsDetail || [])],
        weightliftSetsDetail: [...(existingRoutine.weightliftSetsDetail || []), ...(args.weightliftSetsDetail || [])],
        cardioSetsDetail: [...(existingRoutine.cardioSetsDetail || []), ...(args.cardioSetsDetail || [])],
        crunchesSetsDetail: [...(existingRoutine.crunchesSetsDetail || []), ...(args.crunchesSetsDetail || [])],
        squatsSetsDetail: [...(existingRoutine.squatsSetsDetail || []), ...(args.squatsSetsDetail || [])],
        customSetsDetail: mergedCustomSets,
      });
    } else {
      await ctx.db.insert("routines", {
        ...args,
        logCount: 1,
        createdAt: Date.now(),
      });
    }
  },
});

export const getUserRoutines = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("routines")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});
