import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveRoutine = mutation({
  args: {
    userId: v.string(),
    date: v.string(),
    pushups: v.number(),
    weightlifts: v.number(),
    cardio: v.number(),
    custom: v.number(),
    volume: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("routines")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId).eq("date", args.date)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        createdAt: Date.now(),
      });
    } else {
      await ctx.db.insert("routines", {
        ...args,
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
