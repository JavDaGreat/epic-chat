import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, orderBy } from "firebase/firestore";
import { db } from "@/app/firebase";

const useMessages = (roomId) => {
  const [snapshot] = useCollection(
    roomId
      ? query(
          collection(db, `rooms/${roomId}/messages`),
          orderBy("timeStamp", "asc")
        )
      : null
  );

  const messages = snapshot?.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return messages;
};

export default useMessages;
