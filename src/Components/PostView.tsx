import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// day.js setup
dayjs.extend(relativeTime);

type postWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: postWithUser) => {
  const { post, author } = props;

  return (
    <div key={post?.id} className="border-clate-400 flex gap-6 border-b p-8">
      <Image
        src={author?.profileImageUrl}
        alt={`Users Profile image`}
        className="h-12 w-12 justify-self-start rounded-full"
        width={56}
        height={56}
      />
      <div>
        <div className="font-bold text-slate-300">
          <span>@{author?.username}</span>
          <span className="text-sm font-thin">{` - ${dayjs(
            post?.createdAt
          ).fromNow()}`}</span>
        </div>
        <p className="text-3xl text-white">{post?.content}</p>
      </div>
    </div>
  );
};

export default PostView;
