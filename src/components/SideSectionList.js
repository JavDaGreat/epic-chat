import React from "react";
import { CircularProgress } from "@mui/material";
import SideSectionListItem from "./SideSectionListItem";
import { CancelOutlined } from "@mui/icons-material";

export default function SideSectionList({ title, data }) {
  if (!data) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }
  if (!data.length && title === "Search Results") {
    return (
      <div className="flex gap-4 p-2 mt-10">
        <CancelOutlined />

        <h2>No {title}</h2>
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
