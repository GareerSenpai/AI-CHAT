import ChatList from "@/components/ChatList";
import { SidebarContext } from "@/contexts/SidebarProvider";
import React, { useContext, useRef, useState } from "react";
import { Outlet } from "react-router-dom";

const DashBoardLayout = () => {
  const { isSidebarOpen } = useContext(SidebarContext);
  return (
    <div className="flex h-full pt-[20px] relative">
      <div
        className={`sidebar bg-[#0e0c16] w-[300px] h-[96%] max-w-[90%] pr-4 xl:pr-16 flex flex-col mt-2 absolute transition-all duration-300 overflow-hidden ${
          isSidebarOpen ? "z-10 left-0" : "z-[-10] left-[-100%] lg:left-0"
        }`}
      >
        <ChatList />
      </div>
      <div
        className={`flex-[1] bg-[#12101b] flex flex-col mt-2 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-[350px]" : ""
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default DashBoardLayout;
