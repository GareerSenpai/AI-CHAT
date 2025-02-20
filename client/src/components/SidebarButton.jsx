import { SidebarContext } from "@/contexts/SidebarProvider";
import React, { useContext } from "react";

const SidebarButton = () => {
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
  return (
    <div
      onClick={() => toggleSidebar()}
      className={`cursor-pointer h-full flex flex-col justify-center items-start  ${
        isSidebarOpen ? "gap-[9px]" : "gap-[6px]"
      }`}
    >
      <div
        className={`line w-[35px] h-[3px] bg-gray-500 transition-all duration-200 ease-out ${
          isSidebarOpen && "rotate-45 origin-left"
        }`}
      ></div>
      <div
        className={`line w-[35px] h-[3px] bg-gray-500 transition-all duration-200 ease-out ${
          isSidebarOpen && "opacity-0"
        }`}
      ></div>
      <div
        className={`line w-[35px] h-[3px] bg-gray-500 transition-all duration-200 ease-out ${
          isSidebarOpen && "-rotate-45 origin-left"
        }`}
      ></div>
    </div>
  );
};

export default SidebarButton;
