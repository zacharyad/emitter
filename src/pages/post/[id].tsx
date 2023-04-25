import Head from "next/head";
import { useUser, SignInButton, SignOutButton, SignIn } from "@clerk/nextjs";
import { api } from "~/utils/api";
import CreatePostWizard from "~/Components/CreatePostWizard";
import { PageLayout } from "~/Components/layout";
import { GetStaticProps, type NextPage } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import PostView from "~/Components/PostView";
import LoadingPage from "~/Components/loading";
const PostPage: NextPage<{ postId: string }> = (props: { postId: string }) => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  // eagerly running this so it is cached and able to be used in the Feed Component
  const { data: post, isLoading } = api.postsRouter.getPostByPostId.useQuery({
    postId: props.postId,
  });

  if (!post || !post[0])
    return <div> Sorry this post does not exist anymore</div>;

  return (
    <>
      <Head>
        <title>Post View</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageLayout>
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
            <PostView {...post[0]} />
          </div>
        </main>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const postId = context.params?.id;

  if (typeof postId !== "string") throw new Error("No Slug");

  await ssg.postsRouter.getPostByPostId.prefetch({ postId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default PostPage;
