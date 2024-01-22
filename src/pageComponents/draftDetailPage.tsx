"use client";

import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { Card } from "@/components/ui/card";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DraftDetailPage(props: { draftId: Id<"drafts"> }) {
  const draftId = props.draftId;

  const draft = useQuery(api.draft.getDraft, {
    id: draftId,
  });

  const joinDraftMutation = useMutation(api.draft.joinDraft);
  const beginDraftMutation = useMutation(api.draft.beginDraft);
  const selectOptionMutation = useMutation(api.draft.selectOption);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );

  const { user } = useUser();

  if (draftId == null) return <div>Invalid Draft ID</div>;
  if (!draft) return <div>Loading...</div>;
  const { draftOptions, players, gameState } = draft;

  const isUserInDraft = user && players.find((p) => p.id == user.id);

  const joinDraft = async () => {
    await joinDraftMutation({ draftId: draftId });
  };

  const beginDraft = async () => {
    await beginDraftMutation({ draftId: draftId });
  };

  const confirmSelection = async () => {
    const optionId = remainingDraftOptions[selectedOptionIndex!]._id;
    if (!optionId) {
      return;
    }

    selectOptionMutation({
      optionId,
      draftId,
    });

    setSelectedOptionIndex(null);
  };

  const remainingDraftOptions = draftOptions.filter((opt) =>
    gameState && gameState.picks
      ? gameState.picks.findIndex((p) => p.option == opt._id) == -1
      : false
  );

  return (
    <div className="p-6">
      {!isUserInDraft && gameState.status == "PENDING" && (
        <Button onClick={joinDraft}>Join Draft</Button>
      )}
      {gameState.status == "PENDING" && (
        <Button onClick={beginDraft}>Begin Draft</Button>
      )}
      <div className="text-4xl mb-4">{draft?.name}</div>
      <div className="mx-auto flex md:flex-row flex-col-reverse gap-2">
        <div className="rounded-lg md:w-1/3 w-full">
          <h2 className="text-lg font-semibold mb-4">
            Remaining Draft Options
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {remainingDraftOptions.map((option, index) => (
              <Card
                className={`flex flex-col items-center p-2 bg-white rounded-xl border-8 aspect-square ${
                  index == selectedOptionIndex && "border-orange-500"
                }`}
                key={option.name}
                onClick={() => setSelectedOptionIndex(index)}
              >
                <img
                  alt="Option Image"
                  className="w-full h-24 object-contain mb-2"
                  height="150"
                  src={option.imageUrl || "placeholder.svg"}
                  style={{
                    aspectRatio: "150/150",
                    objectFit: "contain",
                  }}
                  width="150"
                />
                <h3 className="text-lg font-bold text-black">{option.name}</h3>
              </Card>
            ))}
          </div>
          <Button
            size={"lg"}
            variant={"outline"}
            className={`w-full mt-6`}
            disabled={selectedOptionIndex == null}
            onClick={confirmSelection}
          >
            Confirm Selection
          </Button>
        </div>
        <div className="grid grid-cols-12 gap-2 md:w-2/3 w-full">
          <div className="col-span-1"></div>
          {players.map((player) => (
            <div className="rounded-lg col-span-2" key={player.id}>
              <h2
                className={`text-lg mb-4 text-center ${
                  player.id == gameState.playerTurnId &&
                  "text-bold text-green-500"
                }`}
              >
                {player.name}
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {gameState &&
                  gameState.picks &&
                  gameState.picks
                    .filter((option) => option.playerId == player.id)
                    .map((opt) =>
                      draftOptions.find(
                        (draftOption) => draftOption._id == opt.option
                      )
                    )
                    .map((option) => (
                      <Card
                        className="flex flex-col items-center p-2 bg-white rounded-xl border-8 aspect-square"
                        key={option?.name}
                      >
                        <img
                          alt="Option Image"
                          className="w-full h-24 object-cover mb-2"
                          height="150"
                          src={option?.imageUrl || "placeholder.svg"}
                          style={{
                            aspectRatio: "150/150",
                            objectFit: "contain",
                          }}
                          width="150"
                        />
                        <h3 className="text-lg font-bold text-black">
                          {option?.name}
                        </h3>
                      </Card>
                    ))}
              </div>
            </div>
          ))}
          <div className="col-span-1"></div>
        </div>
      </div>
    </div>
  );
}
