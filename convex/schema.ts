import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    deletedAt: v.optional(v.number()),
  })
    .index("by_deletedAt", ["deletedAt"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["deletedAt"],
    }),
  issues: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done"),
    ),
  }).index("by_project", ["projectId"]),
});
