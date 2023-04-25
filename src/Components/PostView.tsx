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
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Link href={`/@${author.username}`}>
        <Image
          src={author.profileImageUrl}
          className="h-14 w-14 rounded-full"
          alt={`@${author.username}'s profile picture`}
          width={56}
          height={56}
        />
      </Link>
      <div className="flex w-full flex-col">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username} `}</span>
          </Link>
          <span className="font-thin">{` · ${dayjs(
            post.createdAt
          ).fromNow()}`}</span>
        </div>
        <Link href={`/post/${post.id}`}>
          <span className="w-full text-2xl">{post.content}</span>
        </Link>
      </div>
    </div>
  );
};

export default PostView;
