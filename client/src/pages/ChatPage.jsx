import NewPromt from "@/components/NewPromt";
import { useQuery } from "@tanstack/react-query";
import { IKImage } from "imagekitio-react";
import React, { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { useLocation, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const {
    isPending,
    error,
    data: chatData,
  } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`http://localhost:3000/api/chats/${chatId}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .catch((err) => console.log(err)),
  });
  // console.log(chatData);

  return (
    <div className="flex flex-col h-full items-center" name="chatPage">
      <div
        className="flex-1 flex justify-center overflow-y-auto w-full"
        name="wrapper"
      >
        <div className="w-1/2 flex flex-col space-y-2.5" name="chat">
          {chatData?.history?.map((message) => (
            <>
              <div className="self-end">
                {message.img && (
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGEKIT_ENDPOINT}
                    path={message.img}
                    width="300"
                    transformation={[{ width: "300" }]}
                  />
                )}
              </div>
              <div
                className={`p-[20px] ${
                  message.role === "user" &&
                  "rounded-[12px] bg-[#2c2937] self-end max-w-[80%]"
                }`}
                name="message"
                key={message.id}
              >
                {message.role === "model" ? (
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {message.parts[0].text}
                  </Markdown>
                ) : (
                  message.parts[0].text
                )}
              </div>
            </>
          ))}
          <NewPromt data={chatData} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
