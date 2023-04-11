import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { api } from "~/utils/api";
import { EventHandler, useState } from "react";

const CreatePostWizard = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      ctx.posts.getAll.invalidate();
    },
  });

  if (!user) return null;
  console.log(user);

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user?.profileImageUrl}
        alt={`Users profile image`}
        className={`h-16 w-16 rounded-full ${isPosting ? "opacity-30" : ""}`}
        width={56}
        height={56}
      />
      <input
        type="text"
        placeholder="Type some emojis..."
        className="w-11/12 grow bg-transparent p-4"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      />
      <button onClick={() => mutate({ content: input })}>Submit</button>
    </div>
  );
};

export default CreatePostWizard;
