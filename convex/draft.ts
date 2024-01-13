import { action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

export const createDraft = action({
  args: {
    name: v.string(),
    options: v.array(
      v.object({
        name: v.string(),
        image: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Can happen in background
    args.options.forEach(async (option) => {
      const imageBlob = new Blob([option.image]);
      ctx.storage.store(imageBlob);
    });

    const data: Id<"drafts"> = await ctx.runMutation(
      internal.draft.createDraftMutation,
      args
    );

    return data;
  },
});

export const createDraftMutation = internalMutation({
  args: {
    name: v.string(),
    options: v.array(
      v.object({
        name: v.string(),
        image: v.string(),
      })
    ),
  },
  handler: async (ctx, { name, options }) => {
    const draftOptions = await Promise.all(
      options.map(async (option) => {
        return await ctx.db.insert("draftOptions", {
          name: option.name,
        });
      })
    );

    const draft = ctx.db.insert("drafts", {
      name,
      options: draftOptions,
    });

    return draft;
  },
});
