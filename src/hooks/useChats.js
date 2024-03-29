import { db } from "@/app/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, orderBy } from "firebase/firestore";

export default function useChats(user) {
  const [snapshot] = useCollection(
    query(
      collection(db, `users/${user.uid}/chats`),
      orderBy("timeStamp", "desc")
    )
  );

  const chats = snapshot?.docs?.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return chats;
}
