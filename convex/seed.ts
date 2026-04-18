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
    // Seeded data needs an owner. We use the first user in the `users`
    // table — typically whoever signed in first during development. If the
    // table is empty, the seed refuses to run and tells you what to do.
    const owner = await ctx.db.query("users").first();
    if (owner === null) {
      throw new Error(
        "No users found. Sign in with GitHub in the app at least once before running the seed script.",
      );
    }

    for (const project of args.projects) {
      const projectId = await ctx.db.insert("projects", {
        name: project.name,
        description: project.description,
        ownerId: owner._id,
      });

      for (const issue of project.issues) {
        await ctx.db.insert("issues", {
          projectId,
          creatorId: owner._id,
          title: issue.title,
          description: issue.description,
          status: issue.status,
        });
      }
    }
  },
});
