"use client";
import SideSectionTab from "./SideSectionTab";
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
  addDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import {
  Home,
  Message,
  PeopleAlt,
  SearchOutlined,
  AddCircle,
} from "@mui/icons-material";
import SideSectionList from "./SideSectionList";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { auth, db } from "@/app/firebase";
import { useRouter } from "next/navigation";
import useRooms from "@/hooks/useRooms";
import useUsers from "@/hooks/useUsers";
import useChats from "@/hooks/useChats";

const tabs = [
  {
    id: 1,
    icon: <Home />,
  },
  {
    id: 2,
    icon: <Message />,
  },
  {
    id: 3,
    icon: <PeopleAlt />,
  },
];

export default function SideSection({ user }) {
  const [menu, setMenu] = useState(1);
  const [isCreatingRoom, setCreatingRoom] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const rooms = useRooms();
  const users = useUsers(user);
  const chats = useChats(user);

  async function createRoom() {
    if (roomName?.trim()) {
      const roomRef = collection(db, "rooms");
      const newRoom = await addDoc(roomRef, {
        name: roomName,
        timestamp: serverTimestamp(),
      });
      setCreatingRoom(false);
      setRoomName("");
      setMenu(2);
      router.push(`/?roomId =${newRoom.id}`);
    }
  }

  async function searchUsersAndRooms(event) {
    event.preventDefault();
    const searchValue = event.target.elements.search.value;
    const userQuery = query(
      collection(db, "users"),
      where("name", "==", searchValue)
    );
    const roomQuery = query(
      collection(db, "rooms"),
      where("name", "==", searchValue)
    );
    const userSnapshot = await getDocs(userQuery);
    const roomsSnapshot = await getDocs(roomQuery);

    const userResults = userSnapshot?.docs.map((doc) => {
      const id =
        doc.id > user.uid ? `${doc.id}${user.uid}` : `${user.uid}${doc.id}`;
      return { id, ...doc.data() };
    });
    const roomResults = roomsSnapshot?.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const searchResults = [...(userResults || []), ...(roomResults || [])];
    setMenu(4);
    setSearchResults(searchResults);
  }

  return (
    <div className="bg-white h-screen w-full felx flex-col  ">
      <section>
        <section
          className="flex h-20 items-center sm:p-2 
        sm:justify-between  flex-wrap p-[2px]">
          <section className="flex flex-wrap items-center sm:gap-4">
            <Avatar src={user.photoURL} alt={user.displayName} />
            <h4 className="text-md sm:font-bold font-semibold p-[2px]">
              {user?.displayName}
            </h4>
          </section>

          <section>
            <IconButton
              onClick={() => {
                auth.signOut(), router.push("/");
              }}>
              <ExitToAppIcon />
            </IconButton>
          </section>
        </section>
      </section>

      <section className="h-20 w-full bg-slate-100 flex ">
        <form
          onSubmit={searchUsersAndRooms}
          className="rounded-md p-2 m-1 w-full flex items-center">
          <div className="relative w-full">
            <input
              type="text"
              id="search"
              placeholder="Search"
              className="w-full rounded-md p-1 pl-8"
            />
            <SearchOutlined className="absolute top-1/2 transform -translate-y-1/2 left-2 text-gray-500" />
          </div>
        </form>
      </section>

      <section className="flex w-full sm:justify-between sm:px-16 sm:py-4 bg-slate-200">
        {" "}
        {tabs.map((tab) => (
          <SideSectionTab
            key={tab.id}
            onClick={() => setMenu(tab.id)}
            isActiv={tab.id === menu}>
            <div>{tab.icon}</div>
          </SideSectionTab>
        ))}
      </section>

      {menu === 1 ? (
        <SideSectionList title="Chats" data={chats} />
      ) : menu === 2 ? (
        <SideSectionList title="Rooms" data={rooms} />
      ) : menu === 3 ? (
        <SideSectionList title="Users" data={users} />
      ) : menu === 4 ? (
        <SideSectionList title="Search Results" data={searchResults} />
      ) : null}

      <div
        id="add"
        className="absolute bottom-0 left-0 p-4 flex justify-center items-center">
        <AddCircle
          sx={{ fontSize: 50 }}
          onClick={() => setCreatingRoom(true)}
        />
      </div>

      <div>
        <Dialog
          maxWidth="sm"
          open={isCreatingRoom}
          onClose={() => setCreatingRoom(false)}>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Type the name of your public room.Every User Will be Able to join
              Your room.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="roomName"
              label="Room Name"
              type="text"
              fullWidth
              variant="standard"
              style={{ marginTop: 20 }}
              onChange={(e) => setRoomName(e.target.value)}
              value={roomName}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setCreatingRoom(false)}
              className="bg-red-500 text-white hover:bg-red-600 hover:text-white">
              Cancel
            </Button>
            <Button
              className="bg-green-500 text-white hover:bg-green-600 hover:text-white"
              onClick={createRoom}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
