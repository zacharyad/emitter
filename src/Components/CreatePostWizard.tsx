import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { api } from "~/utils/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../Components/loading";

const CreatePostWizard = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.postsRouter.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.postsRouter.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;

      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0], {
          duration: 3000,
          position: "bottom-center",
          // Custom Icon
          icon: "🙀",

          // Change colors of success/error/loading icon
          iconTheme: {
            primary: "#000",
            secondary: "#232323",
          },
        });
      } else {
        toast.error("Failed to post. Sorry, please post again later.", {
          duration: 3000,
          position: "bottom-center",
          // Custom Icon
          icon: "🙀",

          // Change colors of success/error/loading icon
          iconTheme: {
            primary: "#000",
            secondary: "#232323",
          },
        });
      }
    },
  });

  if (!user) return null;

  return (
    <div className="flex w-full gap-3 border-yellow-50">
      <Image
        src={user?.profileImageUrl}
        alt={`Users profile image`}
        className={`h-16 w-16 rounded-full ${isPosting ? "opacity-30" : ""}`}
        width={56}
        height={56}
        priority
      />
      <input
        type="text"
        placeholder="Type some emojis..."
        className={`w-11/12 grow bg-transparent p-4`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={({ key }) => {
          if (key === "Enter") mutate({ content: input });
        }}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })}>Submit</button>
      )}

      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

export default CreatePostWizard;
