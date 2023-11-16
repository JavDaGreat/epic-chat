"use client";
import Login from "@/components/Login";
import Image from "next/image";
import backimg from "../../public/background.jpg";
import useAuthUser from "@/hooks/useAuthUser";

export default function Home() {
  useAuthUser();
  return (
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
}
