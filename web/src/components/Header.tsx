"use client";

import React from "react";
import { Button } from "./ui/button";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = async () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    queryClient.removeQueries();
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center border-b-2  pb-4">
      <div>
        <h1 className="text-xl rounded-2xl">Dashboard</h1>
      </div>
      <div>
        <Button className="bg-red-500 text-white hover:bg-red-600" onClick={logout}>Logout</Button>
      </div>
    </div>
  );
}
