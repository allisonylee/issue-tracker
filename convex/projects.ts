import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";

const CASCADE_DELETE_BATCH_SIZE = 100;

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.search) {
      return await ctx.db
        .query("projects")
        .withSearchIndex("search_name", (q) =>
          q.search("name", args.search!).eq("deletedAt", undefined),
        )
        .paginate(args.paginationOpts);
    }

    return await ctx.db
      .query("projects")
      .withIndex("by_deletedAt", (q) => q.eq("deletedAt", undefined))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const get = query({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    return project && project.deletedAt === undefined ? project : null;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
    });
    return projectId;
  },
});

export const remove = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { deletedAt: Date.now() });
  },
});

export const deleteProjectCascade = internalMutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const issues = await ctx.db
      .query("issues")
      .withIndex("by_project", (q) => q.eq("projectId", args.id))
      .take(CASCADE_DELETE_BATCH_SIZE);

    for (const issue of issues) {
      await ctx.db.delete(issue._id);
    }

    if (issues.length === CASCADE_DELETE_BATCH_SIZE) {
      await ctx.scheduler.runAfter(0, internal.projects.deleteProjectCascade, {
        id: args.id,
      });
      return;
    }

    await ctx.db.delete(args.id);
  },
});
