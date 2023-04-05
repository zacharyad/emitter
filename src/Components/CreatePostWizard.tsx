import { useUser } from "@clerk/nextjs";

const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) return null;
  console.log(user);

  return (
    <div className="flex w-full gap-3">
      <img
        src={user.profileImageUrl}
        alt={`Image of the user, ${user.username}`}
        className="h-16 w-16 rounded-full"
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
