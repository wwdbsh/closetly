import type { Route } from "./+types/navigation.layout";

import { Suspense } from "react";
import { Await, Outlet } from "react-router";

import Footer from "../components/footer";
import { NavigationBar } from "../components/navigation-bar";
import makeServerClient from "../lib/supa-client.server";

export async function loader({ request }: Route.LoaderArgs) {
  const [client] = makeServerClient(request);
  const userPromise = client.auth.getUser();
  return { userPromise };
}

export default function NavigationLayout({ loaderData }: Route.ComponentProps) {
  const { userPromise } = loaderData;
  return (
    <div className="flex min-h-screen flex-col justify-between items-center bg-background">
      <main className="w-full max-w-md sm:max-w-lg md:max-w-xl flex-1 bg-[#FFF] shadow-md rounded-lg min-h-[80vh] flex flex-col">
        <Suspense fallback={<NavigationBar loading={true} />}>
          <Await resolve={userPromise}>
            {({ data: { user } }) =>
              user === null ? (
              // user !== null ? (
                <NavigationBar loading={false} />
              ) : (
                <NavigationBar
                  name={'이상헌'}
                  nickname={'도닥이'}
                  email={'sangheonlee@gmail.com'}
                  avatarUrl={'https://github.com/wwdbsh.png'}
                  loading={false}
                  // name={user.user_metadata.name || "Anonymous"}
                  // email={user.email}
                  // avatarUrl={user.user_metadata.avatar_url}
                  // loading={false}
                />
              )
            }
          </Await>
        </Suspense>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
