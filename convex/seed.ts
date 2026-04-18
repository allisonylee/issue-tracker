import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const insertSeedData = internalMutation({
  args: {
    projects: v.array(
      v.object({
        name: v.string(),
        description: v.optional(v.string()),
        issues: v.array(
          v.object({
            title: v.string(),
            description: v.string(),
            status: v.union(
              v.literal("todo"),
              v.literal("in-progress"),
              v.literal("done"),
            ),
          }),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const project of args.projects) {
      const projectId = await ctx.db.insert("projects", {
        name: project.name,
        description: project.description,
      });

      for (const issue of project.issues) {
        await ctx.db.insert("issues", {
          projectId,
          title: issue.title,
          description: issue.description,
          status: issue.status,
        });
      }
    }
  },
});
