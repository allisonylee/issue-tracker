import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    ownerId: v.id("users"),
    deletedAt: v.optional(v.number()),
  })
    .index("by_deletedAt", ["deletedAt"])
    .index("by_owner", ["ownerId"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["deletedAt"],
    }),
  issues: defineTable({
    projectId: v.id("projects"),
    creatorId: v.id("users"),
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done"),
    ),
  }).index("by_project", ["projectId"]),
});
