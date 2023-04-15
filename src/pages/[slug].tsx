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

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profileRouter.getUserByUsername.useQuery({
    username,
  });

  if (!user) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${user?.username || "user"}'s Profile Page`}</title>
        <meta
          name="description"
          content="This is a twitter clone using emojis based on tutorial to test out t3 stack"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        {/* The content Area */}
        <p>{`${user?.username || "user"}'s Profile Page`}</p>
        <Image
          src={user?.profileImageUrl}
          alt={`Users profile image`}
          className={`h-16 w-16 rounded-full`}
          width={56}
          height={56}
          priority
        />
      </main>
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
