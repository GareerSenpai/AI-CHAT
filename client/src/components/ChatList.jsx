import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";

const ChatList = () => {
  const {
    isPending,
    error,
    data: userChatsData,
  } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch("http://localhost:3000/api/userchats", {
        credentials: "include",
      })
        .then((res) => res.json())
        .catch((err) => console.log(err)),
  });
  console.log(userChatsData);

  return (
    <div name="chatList" className="flex flex-col h-full">
      <span name="title" className="font-semibold text-[10px] mb-[10px]">
        DASHBOARD
      </span>
      <Link
        to="/dashboard"
        className="p-[10px] rounded-[10px] hover:bg-[#2c2937]"
      >
        Create a new Chat
      </Link>
      <Link to="/" className="p-[10px] rounded-[10px] hover:bg-[#2c2937]">
        Explore Gareer AI
      </Link>
      <Link to="/" className="p-[10px] rounded-[10px] hover:bg-[#2c2937]">
        Contact
      </Link>
      <hr className="border-none h-[2px] bg-[#ddd] opacity-10 rounded-[5px] my-[20px] mx-0" />
      <span name="title" className="font-semibold text-[10px] mb-[10px]">
        RECENT CHATS
      </span>
      <div name="list" className="flex flex-col overflow-y-auto">
        {userChatsData?.map((chat) => (
          <Link
            to={`/dashboard/chats/${chat._id}`}
            className="p-[10px] rounded-[10px] hover:bg-[#2c2937]"
            key={chat._id}
          >
            {chat.title}
          </Link>
        ))}
      </div>
      <hr className="border-none h-[2px] bg-[#ddd] opacity-10 rounded-[5px] my-[20px] mx-0" />
      <div
        name="upgrade"
        className="flex items-center gap-[10px] text-[12px] mt-auto"
      >
        <img src="/logo.png" alt="" className="h-[24px] w-[24px]" />
        <div name="texts" className="flex flex-col">
          <span className="font-semibold">Upgrade to Lama AI Pro</span>
          <span className="text-[#888]">
            Get unlimited access to all features
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
