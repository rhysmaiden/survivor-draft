import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  drafts: defineTable({
    name: v.string(),
    options: v.array(v.id("draftOptions")),
    players: v.array(v.object({ id: v.string(), name: v.string() })),
    gameState: v.object({
      status: v.string(),
      playerTurnId: v.optional(v.string()),
      picks: v.array(
        v.object({ option: v.id("draftOptions"), playerId: v.string() })
      ),
      turnDirection: v.optional(v.string()),
    }),
    owner: v.string(),
  }),
  draftOptions: defineTable({
    name: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  }),
});
