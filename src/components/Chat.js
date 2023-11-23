import Avatar from "@mui/material/Avatar";

import userRoom from "@/hooks/userRoom";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AttachFile, Menu, MoreVert } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ChatFooter from "./ChatFooter";
import { nanoid } from "nanoid";
import {
  setDoc,
  addDoc,
  serverTimestamp,
  collection,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { db } from "@/app/firebase";
import useChatMessages from "@/hooks/useChatMessages";
import ChatMessages from "./ChatMessages";

export default function Chat({ user }) {
  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(null);
  const [audioId, setAudioId] = useState("");

  const [input, setInput] = useState("");
  const userId = user.uid;
  const query = useSearchParams();
  const roomId = query.get("roomId") ?? "";

  const storage = getStorage();
  const messages = useChatMessages(roomId);

  const room = userRoom(roomId, userId);
  function upload(e) {
    const attach = e.target.files[0];
    if (attach) {
      setFile(attach);
      const reader = new FileReader();
      reader.readAsDataURL(attach);
      reader.onload = () => {
        setSrc(reader.result);
      };
    }
  }
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  async function sendMessage(e) {
    e.preventDefault();
    const fileName = nanoid();
    const newMessage = {
      name: user.displayName,
      message: input,
      uid: user.uid,
      timeStamp: serverTimestamp(),
      time: new Date().toLocaleString("en-GB", options),
      ...(file ? { fileURL: "uploading", fileName } : {}),
    };
    setInput("");

    // Set room info
    await setDoc(doc(db, `users/${userId}/chats/${roomId}`), {
      name: room.name,
      photoURL: room.photoURL || null,
      timeStamp: serverTimestamp(),
    });

    // Add new message to the room
    const newDocRef = await addDoc(
      collection(db, `rooms/${roomId}/messages`),
      newMessage
    );

    // Upload the file
    if (file) {
      await uploadBytes(ref(storage, `files/${fileName}`), file);

      // Get download URL after upload is complete
      const url = await getDownloadURL(ref(storage, `files/${fileName}`));

      // Update the message with the file URL
      await updateDoc(doc(db, `rooms/${roomId}/messages/${newDocRef.id}`), {
        fileURL: url,
      });
    }

    setInput("");
  }

  if (!room) return null;

  return (
    <div className="text-red-600 flex flex-col h-screen ">
      <header className="flex p-4 w-full bg-slate-600 justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            className="hidden xs:inline"
            src={room.photoURL}
            alt={room.name}
          />
          <h3>{room.name}</h3>
        </div>

        <div className="flex items-center justify-center">
          <input
            id="file"
            accept="*"
            type="file"
            className="hidden"
            onChange={(e) => upload(e)}
          />

          <IconButton>
            <label htmlFor="file">
              <AttachFile className="text-red-400 " />
            </label>
          </IconButton>
          <IconButton>
            <MoreVert className="text-red-400 " />
          </IconButton>
          <Menu id="menu" className="hidden">
            <MenuItem>Delete Room</MenuItem>
          </Menu>
        </div>
      </header>

      <div
        className="p-2 flex-grow overflow-y-auto flex flex-col gap-4 "
        id="chats"
        style={{ maxHeight: "calc(100vh - 100px)" }}>
        {" "}
        <ChatMessages
          setAudioId={setAudioId}
          audioId={audioId}
          messages={messages}
          user={user}
          roomdId={roomId}
        />
      </div>

      <footer className="w-full p-2 flex justify-center ">
        <ChatFooter
          input={input}
          onChange={(e) => setInput(e.target.value)}
          file={file}
          user={user}
          room={room}
          roomId={roomId}
          sendMessage={sendMessage}
          setAudioId={setAudioId}
        />
      </footer>
    </div>
  );
}
