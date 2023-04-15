import { type NextPage } from "next";
import Head from "next/head";
import { useUser, SignInButton, SignOutButton, SignIn } from "@clerk/nextjs";
import { api } from "~/utils/api";
import CreatePostWizard from "~/Components/CreatePostWizard";

const PostPage: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  // eagerly running this so it is cached and able to be used in the Feed Component
  api.postsRouter.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Post View</title>
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
          {/* The content Area */}
          <div>Post View</div>
          <p>Here is where the post you just clicked on will show up</p>
        </div>
      </main>
    </>
  );
};

export default PostPage;