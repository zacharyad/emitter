import { RouterOutputs } from "~/utils/api";

type postWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: postWithUser) => {
  const { post, author } = props;

  return (
    <div key={post?.id} className="border-clate-400 flex gap-6 border-b p-8">
      <img
        src={author?.profileImageUrl}
        alt={`${author?.username} profile image`}
        className="h-12 w-12 justify-self-start rounded-full"
      />
      <p className="text-white">{post?.content}</p>
    </div>
  );
};

export default PostView;
