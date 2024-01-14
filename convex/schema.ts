import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  drafts: defineTable({
    name: v.string(),
    options: v.array(v.id("draftOptions")),
    players: v.array(v.id("players")),
  }),
  draftOptions: defineTable({
    name: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  }),
  players: defineTable({
    name: v.string(),
  }),
});
