import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getRandomInt } from "./mathUtils";

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
    const user = await ctx.auth.getUserIdentity();
    if (!user) return null;

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
      owner: user.subject,
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

    // Player already in game
    if (existingPlayers.find((p) => p.id == user.subject)) {
      return;
    }

    ctx.db.patch(args.draftId, {
      players: [
        ...existingPlayers,
        { id: user.subject, name: user.givenName ?? user.subject.slice(0, 9) },
      ],
    });

    return null; // Add a return statement
  },
});

export const beginDraft = mutation({
  args: {
    draftId: v.id("drafts"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) return null;

    const draft = await ctx.db.get(args.draftId);

    const gameState = draft?.gameState;

    if (!gameState) return;

    gameState.status = "IN_PROGRESS";
    const playersShuffled = draft.players
      .slice()
      .sort(() => Math.random() - 0.5);

    gameState.playerTurnId = playersShuffled[0].id;
    gameState.turnDirection = "RIGHT";

    ctx.db.patch(args.draftId, {
      gameState,
      players: playersShuffled,
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

    let nextPlayerIndex = currentPlayerIndex;
    if (gameState.turnDirection == "RIGHT") {
      if (currentPlayerIndex == playersInGame - 1) {
        gameState.turnDirection = "LEFT";
      } else {
        nextPlayerIndex = currentPlayerIndex + 1;
      }
    } else {
      if (currentPlayerIndex == 0) {
        gameState.turnDirection = "RIGHT";
      } else {
        nextPlayerIndex = currentPlayerIndex - 1;
      }
    }

    // Number of turns in game vs number of turns for everyone to have equal players
    if (
      gameState.picks.length + 1 >=
      Math.floor(draft.options.length / playersInGame) * playersInGame
    ) {
      gameState.status = "ENDED";
    }

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
