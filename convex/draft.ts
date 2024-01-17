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

export const getDrafts = query({
  handler: async (ctx) => {
    const drafts = await ctx.db.query("drafts").collect();
    return drafts;
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
      gameState: {
        status: "PENDING",
        picks: [],
      },
    });
    return draft;
  },
});

export const joinDraft = mutation({
  args: {
    draftId: v.id("drafts"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) return null;

    const draft = await ctx.db.get(args.draftId);

    const existingPlayers = draft?.players || []; // Initialize as an empty array if undefined

    ctx.db.patch(args.draftId, {
      players: [
        ...existingPlayers,
        { id: user.subject, name: user.givenName! },
      ],
    });

    return null; // Add a return statement
  },
});

export const selectOption = mutation({
  args: {
    draftId: v.id("drafts"),
    optionId: v.id("draftOptions"),
  },
  handler: async (
    ctx,
    args: { draftId: Id<"drafts">; optionId: Id<"draftOptions"> }
  ) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) return null;

    const draft = await ctx.db.get(args.draftId);

    if (!draft || !draft.gameState) return;

    const { gameState } = draft;

    const currentPlayerIndex = draft.players.findIndex((p) => user.subject);
    const playersInGame = draft.players.length;

    const nextPlayerIndex =
      currentPlayerIndex + 1 >= playersInGame ? 0 : currentPlayerIndex + 1;

    ctx.db.patch(args.draftId, {
      gameState: {
        ...gameState,
        picks: [
          ...(gameState?.picks || []),
          { option: args.optionId, playerId: user.subject },
        ],
        playerTurnId: draft.players[nextPlayerIndex].id,
      },
    });
  },
});
