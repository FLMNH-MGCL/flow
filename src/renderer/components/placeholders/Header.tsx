import React from "react";
import Text from "./Text";

export default function Header() {
  return (
    <div className="px-4 app-header overflow-hidden grid grid-cols-6 border-b sticky top-0 z-20 bg-white items-center">
      <div className="justify-start col-span-1">
        <div className="flex items-center">
          <Text width="6" />
        </div>
      </div>
      <div className="justify-center col-span-4">
        <div className="flex items-center">
          <Text width="36" />
        </div>
      </div>
    </div>
  );
}
