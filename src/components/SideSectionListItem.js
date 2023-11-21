import React from "react";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";

export default function SideSectionListItem({ item }) {
  return (
    <Link href={`/?roomId=${item.id}`}>
      <div className="p-2 hover:bg-slate-100">
        <div className="flex items-center gap-2 w-full flex-wrap">
          <Avatar
            className="xs:inline hidden"
            style={{ width: 45, height: 45 }}
            src={
              item.photoURL ||
              `https://avatars.dicebear.com/api/jdenticon/${item.id}.svg`
            }
          />
          <h2 className="text-lg font-bold break-all  ">{item.name}</h2>
        </div>
      </div>
    </Link>
  );
}
