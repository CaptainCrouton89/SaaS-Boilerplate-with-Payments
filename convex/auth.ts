import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { ConvexError, v } from "convex/values";
import { action, query, mutation } from "./_generated/server";
import { api } from "./_generated/api";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Anonymous],
});

export const loggedInUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    return user;
  },
});


export const updateUserName = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }
    
    if (!name.trim()) {
      throw new ConvexError("Name cannot be empty");
    }
    
    await ctx.db.patch(userId, { name: name.trim() });
    return { success: true };
  },
});

export const updatePassword = action({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, { currentPassword, newPassword }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    // Get user data via mutation
    const user = await ctx.runMutation(api.auth.getUserById, { userId });
    if (!user?.email) {
      throw new ConvexError("User email not found");
    }

    // First verify the current password by attempting to retrieve the account
    const { retrieveAccount, modifyAccountCredentials } = await import("@convex-dev/auth/server");
    
    try {
      // Verify current password
      await retrieveAccount(ctx, {
        provider: "password",
        account: {
          id: user.email,
          secret: currentPassword,
        },
      });
    } catch (error) {
      throw new ConvexError("Current password is incorrect");
    }

    // Validate new password requirements
    if (newPassword.length < 8) {
      throw new ConvexError("Password must be at least 8 characters long");
    }
    if (!/\d/.test(newPassword)) {
      throw new ConvexError("Password must contain at least one digit");
    }
    if (!/[a-z]/.test(newPassword)) {
      throw new ConvexError("Password must contain at least one lowercase letter");
    }
    if (!/[A-Z]/.test(newPassword)) {
      throw new ConvexError("Password must contain at least one uppercase letter");
    }

    // Update the password
    await modifyAccountCredentials(ctx, {
      provider: "password",
      account: {
        id: user.email,
        secret: newPassword,
      },
    });

    return { success: true };
  },
});

export const getUserById = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId || currentUserId !== userId) {
      throw new ConvexError("Not authorized");
    }
    
    return await ctx.db.get(userId);
  },
});
