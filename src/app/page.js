"use client";
import React from "react";
import Login from "@/components/Login";
import SideSection from "@/components/SideSection";
import Image from "next/image";
import backimg from "../../public/background.jpg";
import useAuthUser from "@/hooks/useAuthUser";
import Chat from "@/components/Chat";

export default function Home() {
  const user = useAuthUser();

  const content = (
    <main className="flex justify-center ">
      <div className=" -z-10 fixed w-screen h-screen ">
        <Image
          src={backimg}
          alt="background pic"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-2 mt-6">
        <Login />
      </div>
    </main>
  );
  if (!user) return content;

  return (
    <main className="flex justify-center min-h-screen  ">
      <div className=" -z-10 fixed w-screen h-screen  bg-slate-700">
        <Image
          src={backimg}
          alt="background pic"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <section className="grid grid-cols-4 w-screen">
        <div className="  col-span-2">
          <SideSection user={user} />
        </div>

        <div className="col-span-2 ">
          <Chat user={user} />
        </div>
      </section>
    </main>
  );
}
