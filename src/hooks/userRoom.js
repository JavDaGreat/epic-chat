import { db } from "@/app/firebase";
import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";

export default function useUserRoom(roomId, userId) {
  const isUserRoom = roomId?.includes(userId);
  const collectionId = isUserRoom ? "users" : "rooms";
  const docId = isUserRoom ? roomId.replace(userId, "") : roomId;
  const [snapshot] = useDocument(
    docId ? doc(db, `${collectionId}/${docId}`) : null
  );

  if (!snapshot?.exists()) return null;

  return {
    id: snapshot.id,
    photoURL:
      snapshot.data()?.photoURL ||
      `https://api.dicebear.com/7.x/icons/svg?seed=${snapshot.id}`,
    ...snapshot.data(),
  };
}
