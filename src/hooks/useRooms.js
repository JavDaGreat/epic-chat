import { db } from "@/app/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  addDoc,
  serverTimestamp,
  collection,
  query,
  orderBy,
} from "firebase/firestore";

export default function useRooms() {
  const [snapshot] = useCollection(
    query(collection(db, "rooms"), orderBy("timestamp", "desc"))
  );
  const rooms = snapshot?.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return rooms;
}
