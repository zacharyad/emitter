import { type NextPage } from "next";
import Head from "next/head";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { api } from "~/utils/api";
import PostView from "~/Components/PostView";
import CreatePostWizard from "~/Components/CreatePostWizard";
import LoadingPage from "../Components/loading";
import { isWeakMap } from "util/types";

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Somthing went wrong fetching posts</div>;
  return (
    <>
      {data?.map((fullPost) => {
        return <PostView {...fullPost} key={fullPost.post.id} />;
      })}
    </>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Emitter App</title>
        <meta
          name="description"
          content="This is a twitter clone using emojis based on tutorial to test out t3 stack"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-screen border-x border-slate-400 md:max-w-2xl">
          <h1 className="justify-self-end text-white">Emitter App!</h1>
          {!!isSignedIn && (
            <SignOutButton>
              <button className="btn border-zinc-300 text-white">
                Sign Out
              </button>
            </SignOutButton>
          )}
          <div className="flex w-full border-b p-4">
            {isSignedIn && <CreatePostWizard />}
            {!isSignedIn && (
              <>
                <SignInButton mode="modal">
                  <button className="btn border-zinc-300 text-white">
                    Sign In
                  </button>
                </SignInButton>
              </>
            )}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
