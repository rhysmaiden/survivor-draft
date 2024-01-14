import { action, internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

export const getDraft = query({
  args: {
    id: v.id("drafts"),
  },
  handler: async (ctx, { id }) => {
    const draft = await ctx.db.get(id);
    if (!draft) {
      return null;
    }

    const draftOptions = await Promise.all(
      draft.options.map(async (optionId) => {
        const draftOption = await ctx.db.get(optionId);
        if (!draftOption?.imageStorageId)
          return { ...draftOption, imageUrl: null };

        const imageUrl = await ctx.storage.getUrl(draftOption?.imageStorageId);
        return { ...draftOption, imageUrl };
      })
    );

    return { ...draft, draftOptions };
  },
});

export const createDraft = mutation({
  args: {
    name: v.string(),
    options: v.array(
      v.object({
        name: v.string(),
        imageStorageId: v.optional(v.id("_storage")),
      })
    ),
  },
  handler: async (ctx, args) => {
    const draftOptionIds = await Promise.all(
      args.options.map(async (option) => {
        const optionId = await ctx.db.insert("draftOptions", {
          name: option.name,
          imageStorageId: option.imageStorageId,
        });
        return optionId;
      })
    );

    const draft = await ctx.db.insert("drafts", {
      name: args.name,
      options: draftOptionIds,
      players: [],
    });
    return draft;
  },
});
