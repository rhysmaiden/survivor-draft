import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

type DraftOption = {
  name: string;
  image: string;
};

export default function Component() {
  const [draftName, setDraftName] = useState("");
  const [draftOptions, setDraftOptions] = useState<DraftOption[]>([]);
  const [optionName, setOptionName] = useState("");
  const [optionImage, setOptionImage] = useState<string>("");
  const [isEditingOption, setIsEditingOption] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const createDraftAction = useAction(api.draft.createDraft);

  const createDraft = async () => {
    const draft = await createDraftAction({
      name: "test",
      options: [
        // {
        //   name: "test",
        //   image: "test",
        // },
      ],
    });
    console.log(draft);
  };

  const createNewOption = () => {
    setIsEditingOption(true);
    draftOptions.push({
      name: "",
      image: "",
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

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const blob = e.target.files[0];
    setOptionImage(URL.createObjectURL(blob));
  };

  return (
    <main
      key="1"
      className="flex flex-col lg:flex-row items-start justify-center min-h-screen py-20"
    >
      <section className="w-full max-w-xl space-y-6">
        <h1 className="text-2xl font-bold mb-4">Create New Draft</h1>
        <form className="w-full space-y-6">
          <div className="space-y-2">
            <Label htmlFor="draft-name">Draft/Game Name</Label>
            <Input
              id="draft-name"
              placeholder="Enter name"
              required
              onChange={(e) => setDraftName(e.target.value)}
            />
          </div>
        </form>
        <h2 className="col-span-full text-xl font-bold mb-4">Draft Options</h2>
        <div className="w-full lg:w-full max-w-4xl mt-8 lg:mt-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
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
                  src={option.image}
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
            <Card className="flex flex-col items-center p-4 border-2 border-dotted border-gray-300">
              <Button
                className="w-full h-full"
                type="button"
                onClick={createNewOption}
              >
                Add Option
              </Button>
            </Card>
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
