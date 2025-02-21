import NewPromt from "@/components/NewPromt";
import { SidebarContext } from "@/contexts/SidebarProvider";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { IKImage } from "imagekitio-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { useLocation, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();
  const { isSidebarOpen } = useContext(SidebarContext);
  const { getToken } = useAuth();

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: null,
    dbData: {},
  });

  const {
    isPending,
    error,
    data: chatData,
  } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () =>
      fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/chats/${chatId}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${await getToken()}` },
      })
        .then((res) => res.json())
        .catch((err) => console.log(err)),
  });

  useEffect(() => {
    if (chatData) {
      setNewQuestion("");
      setNewAnswer("");
      setImg({
        isLoading: false,
        error: null,
        dbData: {},
      });
    }
  }, [chatData]);

  return (
    <div className="flex flex-col h-full items-center" name="chatPage">
      <div
        className="flex-1 flex justify-center overflow-y-auto w-full"
        name="wrapper"
      >
        <div
          className={`flex flex-col w-full sm:w-[65%] lg:${
            isSidebarOpen ? "w-[65%]" : "w-[50%]"
          } space-y-2.5 transition-all duration-300`}
          name="chat"
        >
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
                  "rounded-[12px] bg-[#2c2937] self-end max-w-[80%] break-words"
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
          <NewPromt
            data={chatData}
            newQuestion={newQuestion}
            setNewQuestion={setNewQuestion}
            newAnswer={newAnswer}
            setNewAnswer={setNewAnswer}
            img={img}
            setImg={setImg}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
