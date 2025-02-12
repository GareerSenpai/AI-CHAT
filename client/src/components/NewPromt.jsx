import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPromt = ({ data: chatData }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState([]);
  const [img, setImg] = useState({
    isLoading: false,
    error: null,
    dbData: {},
  });

  console.log(img.dbData);

  const endChatRef = useRef(null);

  useEffect(() => {
    endChatRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatData, question, answer, img.dbData]);

  useEffect(() => {
    console.log(chatData);

    if (chatData && chatData.history?.length > 0) {
      const lastMessage = chatData.history[chatData.history.length - 1];

      if (lastMessage.role === "user") {
        // mutation.mutate({
        //   question: lastMessage.parts[0].text,
        //   onlyAnswer: true,
        // });
        streamAnswer(lastMessage.parts[0].text, true);
      }
    }
  }, [chatData]);

  const queryClient = useQueryClient();

  // const mutation = useMutation({
  //   mutationFn: async ({ question, onlyAnswer = false }) => {
  //     const response = await fetch("http://localhost:3000/api/generate", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         question,
  //         image: img.dbData,
  //         chatId: chatData._id,
  //         onlyAnswer,
  //       }),
  //       credentials: "include",
  //     });

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(
  //         `Request failed with status ${response.status}: ${errorText}`
  //       );
  //     }

  //     const data = await response.text();
  //     return data;
  //   },

  //   onSuccess: (data) => {
  //     if (data) {
  //       setQuestion("");
  //       setAnswer("");
  //       setImg({ isLoading: false, error: null, dbData: {} });
  //       queryClient.invalidateQueries({ queryKey: ["chat", chatData._id] });
  //     } else {
  //       console.error("Answer not found in response");
  //     }
  //   },

  //   onError: (err) => {
  //     console.log("Error", err);
  //   },
  // });

  /* ✅ React Query ONLY updates chat history after streaming */
  const mutation = useMutation({
    mutationFn: async (chatId) => {
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] }); // Refresh chat
    },
    onSuccess: () => {
      console.log("Chat history updated successfully");
      // setQuestion("");
      // setAnswer(""); // Reset after a short delay
      // setImg({ isLoading: false, error: null, dbData: {} });

      // Don't reset the UI immediately; wait for fresh data to arrive
      setTimeout(() => {
        setQuestion("");
        setAnswer(""); // Reset after a short delay
        setImg({ isLoading: false, error: null, dbData: {} });
      }, 100); // Small delay to prevent UI flicker
    },
    onError: (err) => {
      console.log("Error updating chat history:", err);
    },
  });
  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Streams an answer from the server using Server-Sent Events (SSE).
   *
   * @param {string} prompt - The question or prompt to be sent to the server.
   * @param {boolean} onlyAnswer - Flag to indicate whether only the answer should be returned.
   *
   * Constructs query parameters including the prompt, image data, and chat ID,
   * then initializes an EventSource to stream data from the server. Handles incoming
   * data by appending it to the current answer and refreshing the chat list upon completion.
   * Logs and closes the connection on errors.
   */

  /******  49822909-79e6-42aa-a469-3aafb1bcef95  *******/
  const streamAnswer = (prompt, onlyAnswer) => {
    const queryParams = new URLSearchParams({
      question: prompt,
      onlyAnswer, // You can pass true or false based on your use case
      chatId: chatData._id,
      imageFilePath: img.dbData.filePath || "",
      imageURL: img.dbData.url || "",
      imageName: img.dbData.name || "",
    });

    const eventSource = new EventSource(
      `http://localhost:3000/api/generateSSE?${queryParams.toString()}`,
      { withCredentials: true }
    );

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        eventSource.close(); // Close when response is complete
        mutation.mutate(chatData._id); // Refresh chat list
      } else {
        setAnswer((prev) => [...prev, event.data]); // Append streamed chunk
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close(); // Close on error
    };
  };

  // const fetchAnswer = async (question) => {
  //   if (!question) return;
  //   try {
  //     const response = await fetch("http://localhost:3000/api/generate", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ question, image: img.dbData }),
  //       credentials: "include",
  //     });

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(
  //         `Request failed with status ${response.status}: ${errorText}`
  //       );
  //     }

  //     const data = await response.text();
  //     return data;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const prompt = formData.get("prompt");

    e.target.reset();

    if (!prompt) return;
    setQuestion(prompt);
    // mutation.mutate({ question: prompt, onlyAnswer: false });
    streamAnswer(prompt, false);
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
      <form
        action=""
        className="flex justify-center items-center bg-[#2c2937] p-0.5 rounded-[20px] w-full gap-2 !mt-auto !mb-4 my-4"
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
        <input
          placeholder="Ask me anything..."
          type="text"
          className="p-4 rounded-[20px] flex-1 border-none outline-none bg-transparent"
          name="prompt"
        />
        <Button className="p-3.5 rounded-[50%] bg-[#605e68] flex justify-center items-center mr-3">
          <img src="/arrow.png" alt="submit-button" className="w-full h-full" />
        </Button>
      </form>
    </>
  );
};

export default NewPromt;
