import { db } from "@/app/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, orderBy } from "firebase/firestore";

export default function useUsers(user) {
  const [snapshot] = useCollection(
    query(collection(db, "users"), orderBy("timestamp", "desc"))
  );
  const users = [];
  snapshot?.docs.forEach((doc) => {
    const id =
      doc.id > user.uid ? `${doc.id}${user.uid}` : `${user.uid}${doc.id}`;
    if (doc.id !== user.uid) {
      users.push({ id, ...doc.data() });
    }
  });
  return users;
}
