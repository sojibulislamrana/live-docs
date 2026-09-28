import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { canAccessDocument, getOrganizationId } from "./auth";

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.insert("document", {
      title: args.title?.trim() || "Untitled document",
      ownerId: user.subject,
      organizationId: getOrganizationId(user),
      initialContent: args.initialContent,
    });
  },
});

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, { search, paginationOpts }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const organizationId = getOrganizationId(user);
    const trimmedSearch = search?.trim();

    if (trimmedSearch && organizationId) {
      return await ctx.db
        .query("document")
        .withSearchIndex("search_title", (q) =>
          q.search("title", trimmedSearch).eq("organizationId", organizationId),
        )
        .paginate(paginationOpts);
    }

    if (trimmedSearch) {
      return await ctx.db
        .query("document")
        .withSearchIndex("search_title", (q) =>
          q.search("title", trimmedSearch).eq("ownerId", user.subject),
        )
        .paginate(paginationOpts);
    }

    if (organizationId) {
      return await ctx.db
        .query("document")
        .withIndex("by_organization_id", (q) =>
          q.eq("organizationId", organizationId),
        )
        .paginate(paginationOpts);
    }

    return await ctx.db
      .query("document")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
      .paginate(paginationOpts);
  },
});

export const removeById = mutation({
  args: { id: v.id("document") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new ConvexError("Document not found");
    }

    if (!canAccessDocument(user, document)) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.delete(args.id);
  },
});

export const updateById = mutation({
  args: { id: v.id("document"), title: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new ConvexError("Document not found");
    }

    if (!canAccessDocument(user, document)) {
      throw new ConvexError("Unauthorized");
    }

    const title = args.title.trim() || "Untitled document";
    return await ctx.db.patch(args.id, { title });
  },
});

export const getById = query({
  args: { id: v.id("document") },
  handler: async (ctx, { id }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const document = await ctx.db.get(id);
    if (!document || !canAccessDocument(user, document)) {
      return null;
    }

    return document;
  },
});
