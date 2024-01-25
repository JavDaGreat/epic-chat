"use client";
import logo from "../../public/icon.png";
import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase";

export default function Login() {
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  return (
    <div className=" bg-white w-96 h-96 p-6 m-2 rounded flex flex-col  items-center justify-evenly">
      <img
        src="https://dl.dropboxusercontent.com/scl/fi/pcxufw5tfwh26r1fc0t62/icon.png?rlkey=gz4g0xzu4qe9h5z5czmm4um52&dl=0"
        height={80}
        width={80}
        alt="Logo"
      />
      <h2 className=" font-bold text-2xl ">Sign in to Epic chat</h2>
      <Button
        onClick={() => signInWithGoogle()}
        className="bg-blue-800 hover:bg-blue-950"
        variant="contained">
        Sign in with google &nbsp; <FcGoogle size={20} />
      </Button>
    </div>
  );
}
