"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

type DraftOption = {
  name: string;
  image?: Image;
};

type Image = {
  url: string;
  imageStorageId?: Id<"_storage">;
};

export default function Component() {
  const [draftName, setDraftName] = useState("");
  const [draftOptions, setDraftOptions] = useState<DraftOption[]>([]);
  const [optionName, setOptionName] = useState("");
  const [optionImage, setOptionImage] = useState<Image | null>(null);
  const [isEditingOption, setIsEditingOption] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const generateImageUploadUrl = useMutation(api.image.generateUploadUrl);

  const createDraftMutation = useMutation(api.draft.createDraft);

  const createDraft = async () => {
    const draftId = await createDraftMutation({
      name: draftName,
      options: draftOptions
        .filter((op) => op.name !== "")
        .map((op) => ({
          name: op.name,
          imageStorageId: op.image?.imageStorageId,
        })),
    });
    // router.push(`/draft/${draftId}`);
  };

  const createNewOption = () => {
    setIsEditingOption(true);
    draftOptions.push({
      name: "",
      image: undefined,
    });
  };

  const finishOption = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!optionImage || !optionName) {
      console.log("missing option image or name");
      return;
    }

    setDraftOptions([
      ...draftOptions,
      {
        name: optionName,
        image: optionImage,
      },
    ]);

    setOptionName("");
    imageInputRef.current?.value && (imageInputRef.current.value = "");
    setIsEditingOption(false);
  };

  const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const blob = e.target.files[0];

    const uploadUrl = await generateImageUploadUrl();

    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": blob!.type },
      body: blob,
    });

    const { storageId } = await result.json();

    setOptionImage({
      url: URL.createObjectURL(blob),
      imageStorageId: storageId,
    });
  };

  return (
    <main
      key="1"
      className="flex flex-col lg:flex-row items-center min-h-screen py-20"
    >
      <section className="w-full max-w-xl space-y-6">
        <h1 className="text-2xl font-bold mb-4">Create New Draft</h1>
        <form className="w-full space-y-6">
          <div className="space-y-2">
            <Label htmlFor="draft-name">Draft Name</Label>
            <Input
              id="draft-name"
              placeholder="Enter name"
              required
              onChange={(e) => setDraftName(e.target.value)}
            />
          </div>
        </form>
        <h2 className="col-span-full text-xl font-bold mb-4">Draft Options</h2>
        <div className="w-full lg:w-full max-w-4xl mt-8 lg:mt-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {draftOptions
            .filter((op) => op.name != "")
            .map((option) => (
              <Card
                className="flex flex-col items-center p-4"
                key={option.name}
              >
                <img
                  alt="Option Image"
                  className="w-full h-24 object-cover mb-2"
                  height="150"
                  src={option.image?.url || ""}
                  style={{
                    aspectRatio: "150/150",
                    objectFit: "cover",
                  }}
                  width="150"
                />
                <h3 className="text-lg font-bold">{option.name}</h3>
              </Card>
            ))}
          {isEditingOption && (
            <Card className="flex flex-col items-center p-4 border-2 border-gray-300">
              <form className="w-full space-y-2" onSubmit={finishOption}>
                <div className="space-y-2">
                  <label
                    htmlFor="option-image"
                    className="w-full h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded cursor-pointer mb-2 p-2"
                  >
                    <span className="">Upload Image +</span>
                    <input
                      className="hidden"
                      id="option-image"
                      required
                      type="file"
                      onChange={onImageChange}
                    />
                  </label>
                </div>
                <div className="mt-2 mb-2">
                  <Input
                    className="text-md font-bold"
                    id="option-name"
                    placeholder="Name"
                    required
                    onChange={(e) => setOptionName(e.target.value)}
                  />
                </div>
              </form>
            </Card>
          )}

          {!isEditingOption && (
            <Button
              className="w-full h-full border-2 border-dotted border-gray-300"
              type="button"
              onClick={createNewOption}
            >
              Add Option
            </Button>
          )}
        </div>
        <Button
          className="w-full mt-8"
          type="submit"
          size={"lg"}
          variant={"outline"}
          onClick={createDraft}
        >
          Create Draft
        </Button>
        <p className="text-sm  mt-4">
          After creating the draft, a link will be generated for you to share
          with others.
        </p>
      </section>
    </main>
  );
}
