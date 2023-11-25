import Avatar from "@mui/material/Avatar";

import userRoom from "@/hooks/userRoom";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AttachFile, MoreVert } from "@mui/icons-material";
import Menu from "@mui/material/Menu";

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
  deleteDoc,
  query,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { db } from "@/app/firebase";
import useChatMessages from "@/hooks/useChatMessages";
import ChatMessages from "./ChatMessages";

export default function Chat({ user }) {
  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(null);
  const [audioId, setAudioId] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [isDeleting, setDeleting] = useState(false);

  const [input, setInput] = useState("");
  const userId = user.uid;
  const Query = useSearchParams();
  const roomId = Query.get("roomId") ?? "";

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
  async function deleteRoom() {
    setOpenMenu(null);
    setDeleting(true);

    try {
      const userChatRef = doc(db, `users/${userId}/chats/${roomId}`);
      const roomRef = doc(db, `rooms/${roomId}`);
      const roomMessagesRef = collection(db, `rooms/${roomId}/messages`);
      const roomMessages = await getDocs(query(roomMessagesRef));
      const audioFiles = [];
      const files = [];
      roomMessages?.docs.forEach((doc) => {
        if (doc.data().audioName) {
          audioFiles.push(doc.data().audioName);
        } else if (doc.data().fileName) {
          files.push(doc.data().fileName);
        }
      });
      await Promise.all([
        deleteDoc(userChatRef),
        deleteDoc(roomRef),
        ...roomMessages.docs.map((doc) => deleteDoc(doc.ref)),
        ...files.map((fileName) =>
          deleteObject(ref(storage, `files/${fileName}`))
        ),
        ...audioFiles.map((audioName) =>
          deleteObject(ref(storage, `audio/${audioName}`))
        ),
      ]);
    } catch (error) {
      console.log("Error", error);
    } finally {
      setDeleting(false);
    }
  }

  if (!room) return null;

  return (
    <div className=" flex flex-col h-screen ">
      <header className="flex p-4 w-[99%] bg-slate-100 justify-between mx-1 rounded-md">
        <div className="flex items-center gap-3">
          <Avatar
            className="hidden xs:inline"
            src={room.photoURL}
            alt={room.name}
          />
          <h3 className="text-lg font-bold">{room.name}</h3>
        </div>

        <div className="flex items-center justify-center">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={(e) => upload(e)}
          />

          <IconButton>
            <label htmlFor="file">
              <AttachFile />
            </label>
          </IconButton>
          <IconButton>
            <MoreVert
              className=" "
              onClick={(e) => setOpenMenu(e.currentTarget)}
            />
          </IconButton>
          <Menu
            className="mt-2"
            anchorEl={openMenu}
            open={!!openMenu}
            onClose={() => setOpenMenu(null)}
            id="menu">
            <MenuItem onClick={deleteRoom}>Delete Room</MenuItem>
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
