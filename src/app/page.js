"use client";
import React from "react";
import Login from "@/components/Login";
import SideSection from "@/components/SideSection";

import useAuthUser from "@/hooks/useAuthUser";
import Chat from "@/components/Chat";

export default function Home() {
  const user = useAuthUser();

  const content = (
    <main className="flex justify-center bg-background-Image h-screen bg-cover">
      <div className="p-2 mt-6">
        <Login />
      </div>
    </main>
  );
  if (!user) return content;

  return (
    <main className="flex justify-center min-h-screen bg-background-Image bg-cover ">
      <section className="grid grid-cols-6 w-screen">
        <div className="  col-span-3 lg:col-span-2">
          <SideSection user={user} />
        </div>

        <div className="col-span-3 lg:col-span-4 ">
          <Chat user={user} />
        </div>
      </section>
    </main>
  );
}
