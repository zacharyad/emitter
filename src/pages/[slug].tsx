import { type NextPage } from "next";
import Head from "next/head";
import { useUser, SignInButton, SignOutButton, SignIn } from "@clerk/nextjs";
import { api } from "~/utils/api";
import CreatePostWizard from "~/Components/CreatePostWizard";
import Feed from "~/Components/Feed";

const ProfilePage: NextPage = () => {
  const { data, isLoading } = api.profileRouter.getUserByUsername.useQuery({
    username: "matd",
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>404</div>;

  console.log("DATA: ", data);

  return (
    <>
      <Head>
        <title>{`${data.username}'s Profile Page`}</title>
        <meta
          name="description"
          content="This is a twitter clone using emojis based on tutorial to test out t3 stack"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        {/* The content Area */}
        <p>{`${data.username}'s Profile Page`}</p>
      </main>
    </>
  );
};

export default ProfilePage;
