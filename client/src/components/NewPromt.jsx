import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

const NewPromt = ({ data: chatData }) => {
  const { getToken } = useAuth();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState([]);
  const [img, setImg] = useState({
    isLoading: false,
    error: null,
    dbData: {},
  });

  const textareaRef = useRef(null);

  console.log("img dbData: ", img.dbData);

  const endChatRef = useRef(null);

  useEffect(() => {
    endChatRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatData, question, answer, img.dbData]);

  useEffect(() => {
    console.log("chat data: ", chatData);

    if (chatData && chatData.history?.length > 0) {
      const lastMessage = chatData.history[chatData.history.length - 1];

      if (lastMessage.role === "user") {
        mutation.mutate({
          question: lastMessage.parts[0].text,
          onlyAnswer: true,
        });
      }
    }
  }, [chatData]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ question, onlyAnswer = false }) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
          },
          body: JSON.stringify({
            question,
            image: img.dbData,
            chatId: chatData._id,
            onlyAnswer,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data:")) {
            const data = line.replace("data:", "").trim();
            if (data === "[DONE]") {
              break;
            }
            accumulatedText += data;
            setAnswer((prev) => [...prev, data]); // Append streamed chunk
          }
        }
      }

      return accumulatedText;
    },

    onSuccess: (data) => {
      if (data) {
        console.log(data);

        setQuestion("");
        setAnswer([]);
        setImg({ isLoading: false, error: null, dbData: {} });
        queryClient.invalidateQueries({ queryKey: ["chat", chatData._id] });
      } else {
        console.error("Answer not found in response");
      }
    },

    onError: (err) => {
      console.log("Error", err);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const prompt = formData.get("prompt");

    e.target.reset();

    if (!prompt) return;

    setQuestion(prompt);
    mutation.mutate({ question: prompt, onlyAnswer: false });
  };

  return (
    <>
      {/* ADD NEW CHAT */}
      {img.isLoading && <p>Uploading...</p>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGEKIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="300"
          transformation={[{ width: "300" }]}
        />
      )}
      {question && (
        <div
          className="p-[20px] rounded-[12px] bg-[#2c2937] self-end max-w-[80%]"
          name="message-user"
        >
          {question}
        </div>
      )}
      {answer && (
        <div className="p-[20px]" name="message">
          <Markdown remarkPlugins={[remarkGfm]}>{answer.join("")}</Markdown>
        </div>
      )}
      <div className="" name="last div" ref={endChatRef} />
      <div className="!mt-auto xs:px-[20px]" name="form-wrapper">
        <form
          action=""
          className="flex justify-center items-center bg-[#2c2937] p-1 rounded-[20px] w-full gap-2 !mb-4 my-4"
          onSubmit={handleSubmit}
        >
          {/* <label
          htmlFor="attachment"
          className="p-[12px] rounded-[50%] bg-[#605e68] flex justify-center items-center ml-3 cursor-pointer"
        >
          <img src="/attachment.png" alt="attachment" className="w-4 h-4" />
        </label> */}
          <Upload setImg={setImg} />
          <input
            type="file"
            name="attachment"
            id="attachment"
            hidden
            multiple={false}
            accept="image/*"
          />
          <textarea
            ref={textareaRef}
            placeholder="Ask me anything..."
            type="text"
            className="p-4 rounded-[20px] flex-1 border-none outline-none resize-none max-h-[200px] whitespace-pre-wrap bg-transparent"
            name="prompt"
            rows={1}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                textareaRef.current.style.height = "auto";
                e.target.form.requestSubmit();
              }
            }}
          />
          <Button className="p-3.5 rounded-[50%] bg-[#605e68] flex justify-center items-center mr-3">
            <img
              src="/arrow.png"
              alt="submit-button"
              className="w-full h-full"
            />
          </Button>
        </form>
      </div>
    </>
  );
};

export default NewPromt;
