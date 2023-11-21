import React from "react";
import { CircularProgress } from "@mui/material";
import SideSectionListItem from "./SideSectionListItem";

export default function SideSectionList({ title, data }) {
  if (!data) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="w-full  ">
      {" "}
      <h2 className=" text-2xl font-extrabold p-4 ">{title}</h2>
      {data.map((item) => (
        <SideSectionListItem key={item.id} item={item} />
      ))}
    </div>
  );
}
