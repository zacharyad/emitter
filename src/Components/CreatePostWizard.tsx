import { useUser } from "@clerk/nextjs";
import Image from "next/image";
const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) return null;
  console.log(user);

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user?.profileImageUrl}
        alt={`Users profile image`}
        className="h-16 w-16 rounded-full"
        width={56}
        height={56}
      />
      <input
        type="text"
        placeholder="Type some emojis..."
        className="w-11/12 grow bg-transparent p-4"
      />
    </div>
  );
};

export default CreatePostWizard;
