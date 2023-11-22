import Avatar from "@mui/material/Avatar";

import userRoom from "@/hooks/userRoom";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AttachFile, Menu, MoreVert } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";

import IconButton from "@mui/material/IconButton";
import ChatFooter from "./ChatFooter";

export default function Chat({ user }) {
  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(null);
  const userId = user.uid;
  const query = useSearchParams();
  const roomId = query.get("roomId") ?? "";

  const room = userRoom(roomId, userId);
  console.log(file, src);
  if (!room) return null;
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
          <Menu id="menu" keepMounted className="hidden">
            <MenuItem>Delete Room</MenuItem>
          </Menu>
        </div>
      </header>

      <div className=" p-2 flex-grow text-green-600">inja man minivisam</div>

      <footer className="w-full p-2 ">
        <ChatFooter />
      </footer>
    </div>
  );
}
