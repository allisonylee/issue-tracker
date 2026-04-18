import { query } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc } from "./_generated/dataModel";


export const currentUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) return null;
        return await ctx.db.get(userId);
    }
})

export async function getCurrentUser(ctx: QueryCtx | MutationCtx, ): Promise<Doc<"users">> {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
        throw new Error("not autenticated");
    }
    const user = await ctx.db.get(userId);
    if (user === null) {
        throw new Error("Signed-in user no longer exists");
    }
    return user;
}