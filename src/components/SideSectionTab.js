import React from "react";

export default function SideSectionTab({ onClick, isActiv, children }) {
  return (
    <div
      onClick={onClick}
      className={`${
        isActiv ? " bg-gray-50 w-[30%] text-center" : " w-[30%] text-center"
      }`}>
      {children}
    </div>
  );
}
