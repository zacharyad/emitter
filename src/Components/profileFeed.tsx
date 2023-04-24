import { api } from "~/utils/api";
import LoadingPage from "~/Components/loading";
import PostView from "~/Components/PostView";

export const ProfileFeed = (props: { userId: string }) => {
  const { data: usersPosts, isLoading } =
    api.postsRouter.getPostsFromUser.useQuery({
      userId: props.userId,
    });

  if (isLoading) return <LoadingPage />;

  if (!usersPosts) {
    return <div>User has not posted anything, unfortunatley.</div>;
  }
  return (
    <div className=" flex h-full flex-col">
      {usersPosts.map((post) => {
        return (
          <div key={post.post.id}>
            <PostView {...post} />
          </div>
        );
      })}
    </div>
  );
};
