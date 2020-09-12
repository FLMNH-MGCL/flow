import React from "react";
import Text from "./Text";

export default function ListItem({ width }: { width: string }) {
  return (
    <li className="p-6 flex hover:bg-gray-100 transition-colors duration-150 cursor-pointer border-b border-gray-200">
      <Text width={width} />
    </li>
  );
}
