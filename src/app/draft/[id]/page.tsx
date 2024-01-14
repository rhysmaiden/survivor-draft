"use client";

import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { Card } from "@/components/ui/card";

export default function GameBoard(props: { params: { id: Id<"drafts"> } }) {
  if (props.params.id == null) return <div>Invalid Draft ID</div>;

  const draft = useQuery(api.draft.getDraft, { id: props.params.id });

  console.log(draft);

  if (!draft) return <div>Loading...</div>;

  return (
    <div>
      {draft?.name}
      <main className="container mx-auto p-4 md:p-6 flex md:flex-row flex-col-reverse">
        <div className="border rounded-lg p-4 md:w-1/3 w-full md:mr-6">
          <h2 className="text-lg font-semibold mb-4">
            Remaining Draft Options
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {draft.draftOptions.map((option) => (
              <Card
                className="flex flex-col items-center p-4"
                key={option.name}
              >
                <img
                  alt="Option Image"
                  className="w-full h-24 object-cover mb-2"
                  height="150"
                  src={option.imageUrl || "placeholder.svg"}
                  style={{
                    aspectRatio: "150/150",
                    objectFit: "cover",
                  }}
                  width="150"
                />
                <h3 className="text-lg font-bold">{option.name}</h3>
              </Card>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:w-2/3 w-full">
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Player 1's Selection</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-2">
                <img
                  alt="Option 1"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  height={100}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                  }}
                  width={100}
                />
                <h3 className="text-base font-medium">Option 1</h3>
              </div>
              <div className="border rounded-lg p-2">
                <img
                  alt="Option 2"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  height={100}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                  }}
                  width={100}
                />
                <h3 className="text-base font-medium">Option 2</h3>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Player 2's Selection</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-2">
                <img
                  alt="Option 3"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  height={100}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                  }}
                  width={100}
                />
                <h3 className="text-base font-medium">Option 3</h3>
              </div>
              <div className="border rounded-lg p-2">
                <img
                  alt="Option 4"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  height={100}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                  }}
                  width={100}
                />
                <h3 className="text-base font-medium">Option 4</h3>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Player 3's Selection</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-2">
                <img
                  alt="Option 5"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  height={100}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                  }}
                  width={100}
                />
                <h3 className="text-base font-medium">Option 5</h3>
              </div>
              <div className="border rounded-lg p-2">
                <img
                  alt="Option 6"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  height={100}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                  }}
                  width={100}
                />
                <h3 className="text-base font-medium">Option 6</h3>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Player 4's Selection</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-2">
                <img
                  alt="Option 7"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  height={100}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                  }}
                  width={100}
                />
                <h3 className="text-base font-medium">Option 7</h3>
              </div>
              <div className="border rounded-lg p-2">
                <img
                  alt="Option 8"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  height={100}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                  }}
                  width={100}
                />
                <h3 className="text-base font-medium">Option 8</h3>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Player 5's Selection</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-2">
                <img
                  alt="Option 9"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  height={100}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                  }}
                  width={100}
                />
                <h3 className="text-base font-medium">Option 9</h3>
              </div>
              <div className="border rounded-lg p-2">
                <img
                  alt="Option 10"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  height={100}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                  }}
                  width={100}
                />
                <h3 className="text-base font-medium">Option 10</h3>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Player 6's Selection</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-2">
                <img
                  alt="Option 11"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  height={100}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                  }}
                  width={100}
                />
                <h3 className="text-base font-medium">Option 11</h3>
              </div>
              <div className="border rounded-lg p-2">
                <img
                  alt="Option 12"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  height={100}
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "100/100",
                    objectFit: "cover",
                  }}
                  width={100}
                />
                <h3 className="text-base font-medium">Option 12</h3>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
