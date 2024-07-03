"use client";

import React from "react";
import { Button } from "./ui/button";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  const logout = async () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center border-b-2  pb-4">
      <div>
        <h1 className="text-xl rounded-2xl">Dashboard</h1>
      </div>
      <div>
        <Button onClick={logout}>Logout</Button>
      </div>
    </div>
  );
}
