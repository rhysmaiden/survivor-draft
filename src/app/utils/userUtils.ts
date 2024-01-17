import { v4 as uuidv4 } from "uuid";
import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";

export async function getOrCreatePlayer(draftId: Id<"drafts">) {
  const createPlayer = useMutation(api.player.createPlayer);
  const playerId = getCookie("playerId");

  if (playerId) {
    return playerId;
  }

  const newPlayerId = await createPlayer({ name: "test", draftId });
  setCookie("playerId", newPlayerId);
  return newPlayerId;
}

function getCookie(name: string) {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null;
}

function setCookie(name: string, value: string) {
  const expires = new Date(
    Date.now() + 365 * 24 * 60 * 60 * 1000
  ).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}
