import ChatList from "@/components/ChatList";
import { SidebarContext } from "@/contexts/SidebarProvider";
import React, { useContext, useRef, useState } from "react";
import { Outlet } from "react-router-dom";

const DashBoardLayout = () => {
  //TODO: this will come from a global state
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
  return (
    <div className="flex h-full pt-[20px] relative">
      <div
        className={`sidebar w-[300px] h-[90%] pr-4 xl:pr-16 flex flex-col mt-2 absolute -z-10 transition-all duration-300 overflow-hidden ${
          isSidebarOpen ? "z-10" : ""
        }`}
      >
        <ChatList />
      </div>
      <div
        className={`flex-[1] bg-[#12101b] flex flex-col mt-2 transition-all duration-300 ${
          isSidebarOpen ? "ml-[350px]" : ""
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default DashBoardLayout;
