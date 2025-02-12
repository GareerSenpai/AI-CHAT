import ChatList from "@/components/ChatList";
import React from "react";
import { Outlet } from "react-router-dom";

const DashBoardLayout = () => {
  return (
    <div className="flex h-full gap-[50px] pt-[20px]">
      <div className="flex-[1] flex flex-col pr-4 xl:pr-16 mt-2">
        <ChatList />
      </div>
      <div className="flex-[4] bg-[#12101b] flex flex-col mt-2">
        <Outlet />
      </div>
    </div>
  );
};

export default DashBoardLayout;
