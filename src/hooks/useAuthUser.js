import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase";
import { useEffect } from "react";
export default function useAuthUser() {
  const [user] = useAuthState(auth);
  useEffect(() => {
    console.log(user);
  }, [user]);

  return user;
}
