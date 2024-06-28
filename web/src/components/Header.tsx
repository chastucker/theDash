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
    <div className="flex justify-between">
      <div>The Dash</div>
      <div>
        <Button onClick={logout}>logout</Button>
      </div>
    </div>
  );
}
