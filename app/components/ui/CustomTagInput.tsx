import { useState } from "react";
import { Tag, TagInput } from "emblor";

interface CustomTagInputProps {
  placeholder: string;
  state: Tag[];
  setState: React.Dispatch<React.SetStateAction<Tag[]>>;
}

export const CustomTagInput = ({
  placeholder,
  state,
  setState,
}: CustomTagInputProps) => {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  return (
    <TagInput
      placeholder={placeholder}
      tags={state}
      setTags={(value) => setState(value)}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
      styleClasses={{
        input: "shadow-none h-6",
        tag: {
          body: "ml-4 text-xs font-bold bg-calendar-selected text-secondary-teal-green-04 px-2 h-6 flex gap-3 rounded-md",
          closeButton: "border border-black rounded-full w-4 h-4 p-0",
        },
        inlineTagsContainer: "border bg-white px-0 gap-0",
      }}
    />
  );
};
