import { cookies } from "next/headers";
import { Login } from "./page.client";

export default function Page() {
  const setCookies = async (accessToken: string, refreshToken: string) => {
    "use server";
    cookies().set("access_token", accessToken);
    cookies().set("refresh_token", refreshToken);
  };

  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  return (
    <div className="flex-1 flex flex-col w-full sm:max-w-md justify-center gap-2 space-y-6">
      <div>
        <h1 className="text-4xl text-center">The Dash</h1>
      </div>
      <Login setCookies={setCookies} />
      <div>
        <p className="text-center text-sm text-gray-500">
          Having trouble signing up or in? Please contact {email}
        </p>
      </div>
    </div>
  );
}
