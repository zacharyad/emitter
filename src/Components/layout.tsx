import type { PropsWithChildren } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export const PageLayout = (props: PropsWithChildren) => {
  const { user } = useUser();

  const username = `${user?.username || ""}`;

  return (
    <main className="overflow-none relative flex h-screen justify-center">
      <div className="flex h-full w-full flex-col border-x border-slate-400 md:max-w-2xl">
        <div className="absolute right-12 top-4 z-10 flex flex-col justify-between gap-6">
          <Link href="/">
            <button>Feed</button>
          </Link>
          {user && (
            <Link href={`/@${username}`}>
              <button>Profile</button>
            </Link>
          )}
        </div>
        {props.children}
      </div>
    </main>
  );
};
