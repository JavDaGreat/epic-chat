"use client";
import SideSectionTab from "./SideSectionTab";
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
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
  const data = [
    {
      id: 1,
      name: "Are_You_Serious",
      photoURL:
        "https://lh3.googleusercontent.com/a/ACg8ocIISZwoHc7x8IqITjSNhA9Aj_fVXlERh2PjGX8J6oaOIg=s96-c",
    },
  ];

  async function createRoom() {
    console.log(roomName);
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
            <IconButton>
              <ExitToAppIcon />
            </IconButton>
          </section>
        </section>
      </section>

      <section className="h-20 w-full bg-slate-100 flex ">
        <form className="rounded-md p-2 m-1 w-full flex items-center">
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
        <SideSectionList title="Chats" data={data} />
      ) : menu === 2 ? (
        <SideSectionList title="Rooms" data={data} />
      ) : menu === 3 ? (
        <SideSectionList title="Users" data={data} />
      ) : menu === 4 ? (
        <SideSectionList title="SearchResults" data={data} />
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
