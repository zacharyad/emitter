import PostView from "./PostView";
import LoadingPage from "./loading";
import { api } from "~/utils/api";

const Feed = () => {
  // actually from cached data, If it is not different from previous call to it
  const { data, isLoading: postsLoading } = api.postsRouter.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Somthing went wrong fetching posts</div>;

  console.log("FullPost: ", data);

  return (
    <>
      {data.map((fullPost) => {
        return <PostView {...fullPost} key={fullPost.post.id} />;
      })}
    </>
  );
};

export default Feed;
