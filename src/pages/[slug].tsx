import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { api } from "~/utils/api";
//
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
//
import { PageLayout } from "~/Components/layout";
import LoadingPage from "~/Components/loading";
import PostView from "~/Components/PostView";

const ProfileFeed = (props: { userId: string }) => {
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
        return <PostView key={post.post.id} {...post} />;
      })}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profileRouter.getUserByUsername.useQuery({
    username,
  });

  if (!user) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{user.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            src={user.profileImageUrl}
            alt={`${user.username ?? "unknown"}'s profile pic`}
            width={128}
            height={128}
            priority
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${
          user.username ?? "unknown"
        }`}</div>
        <div className="w-full border-b border-slate-400" />
        <div className="h-full overflow-y-scroll">
          <ProfileFeed userId={user.id} />
        </div>
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

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("No Slug");

  const username = slug.substring(1);

  await ssg.profileRouter.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
