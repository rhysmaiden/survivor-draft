import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  drafts: defineTable({
    name: v.string(),
    options: v.array(v.id("draftOptions")),
  }),
  draftOptions: defineTable({
    name: v.string(),
  }),
});
