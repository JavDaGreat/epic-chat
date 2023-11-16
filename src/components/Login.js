"use client";
import Image from "next/image";
import logo from "../app/icon.png";
import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase";

export default function Login() {
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  return (
    <div className=" bg-white w-96 h-96 p-6 m-2 rounded flex flex-col  items-center justify-evenly">
      <Image src={logo} height={80} width={80} alt="Logo" />
      <h2 className=" font-bold text-xl ">Sign in to Epic chat</h2>
      <Button
        onClick={() => signInWithGoogle()}
        className="bg-blue-800 hover:bg-blue-950"
        variant="contained">
        Sign in with google <FcGoogle size={20} />
      </Button>
    </div>
  );
}
