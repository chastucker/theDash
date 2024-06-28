import { cookies } from "next/headers";
import { Login } from "./page.client";

export default function Page() {
  const setCookies = async (accessToken: string, refreshToken: string) => {
    "use server";
    cookies().set("access_token", accessToken);
    cookies().set("refresh_token", refreshToken);
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Login setCookies={setCookies} />
    </div>
  );
}
