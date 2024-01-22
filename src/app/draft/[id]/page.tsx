"use client";

import DraftDetailPage from "@/pageComponents/draftDetailPage";
import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";

export default function Page(props: { params: { id: Id<"drafts"> } }) {
  return <DraftDetailPage draftId={props.params.id} />;
}
