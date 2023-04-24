import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// day.js setup
dayjs.extend(relativeTime);

type postWithUser = RouterOutputs["postsRouter"]["getAll"][number];

const PostView = (props: postWithUser) => {
  const { post, author } = props;
  return (
    <div key={post?.id} className="border-clate-400 flex gap-6 border-b p-4">
      <Link href={`/@${author.username}`}>
        {" "}
        <Image
          src={author?.profileImageUrl}
          alt={`Users Profile image`}
          className="h-12 w-12 justify-self-start rounded-full"
          width={56}
          height={56}
        />
      </Link>
      <div>
        <div className="font-bold text-slate-300">
          <Link href={`${"/@" + author.username || ""}`}>
            <span>@{author?.username || "User"}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="text-sm font-thin">{` - ${dayjs(
              post?.createdAt
            ).fromNow()}`}</span>
            <p className="text-3xl text-white">{post?.content}</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostView;
