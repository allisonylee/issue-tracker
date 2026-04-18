import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const removeDeletedProjects = internalMutation({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_deletedAt", (q) => q.gt("deletedAt", 0))
      .collect();

    for (const project of projects) {
      await ctx.scheduler.runAfter(0, internal.projects.deleteProjectCascade, {
        id: project._id,
      });
    }
  },
});
