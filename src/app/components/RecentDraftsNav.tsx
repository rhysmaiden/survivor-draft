"use client";

import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";

const RecentDraftsNav = () => {
  const recentDrafts = useQuery(api.draft.getDrafts);

  return (
    <nav className="grid items-start gap-4 p-4">
      <Link className="flex items-center gap-2 font-semibold" href="#">
        Recent Drafts
      </Link>
      <div className="grid gap-2">
        {recentDrafts?.map((draft) => (
          <Link
            className="font-normal"
            href={`/draft/${draft._id}`}
            key={draft._id}
          >
            {draft.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default RecentDraftsNav;
