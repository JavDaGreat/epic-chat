import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useEffect } from "react";

export default function useAuthUser() {
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, `users/${user.uid}`);
      getDoc(userRef).then((snapshot) => {
        if (!snapshot.exists()) {
          setDoc(userRef, {
            name: user.displayName,
            photoURL: user.photoURL,
            timestamp: serverTimestamp(),
          });
        }
      });
    }
  }, [user]);

  return user;
}
