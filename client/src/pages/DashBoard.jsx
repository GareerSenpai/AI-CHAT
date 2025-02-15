import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Outlet, useNavigate } from "react-router-dom";

const DashBoard = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (text) => {
      const response = await fetch("http://localhost:3000/api/chats", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, userId }),
      });

      // Ensure the request was successful and extract the response data
      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const data = await response.json(); // Assuming your API returns JSON
      return data; // Assuming the response contains the chat id
    },

    onSuccess: (id) => {
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["userChats"] }); // Comment this line out for now
        navigate(`/dashboard/chats/${id}`);
      } else {
        console.error("Chat ID not found in response");
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;

    mutation.mutate(text);
  };
  return (
    <>
      <section className="flex-1 justify-center items-center flex flex-col gap-7">
        <div className="flex items-center gap-4 opacity-15 select-none">
          <img src="/logo.png" alt="logo" className="h-10 md:h-16" />
          <h1 className="heading-bg text-2xl md:text-4xl xl:text-6xl font-bold">
            GAREER AI
          </h1>
        </div>
        <div
          className="hidden sm:flex lg:w-[50%] lg:my-4 justify-space-between items-center gap-8 mx-4 w-[60%]"
          name="options"
        >
          <div className="border border-[#555] rounded-[20px] flex-1 p-4 px-6 self-stretch">
            <img src="/chat.png" alt="chat-image" className="h-12 mb-2" />
            <p className="text-[14px] font-semibold">Create a New Chat</p>
          </div>
          <div className="border border-[#555] rounded-[20px] flex-1 p-4 px-6 self-stretch">
            <img src="/image.png" alt="image-analysis" className="h-12 mb-2" />
            <p className="text-[14px] font-semibold">Analyze Images</p>
          </div>
          <div className="border border-[#555] rounded-[20px] flex-1 p-4 px-6 self-stretch">
            <img src="/code.png" alt="code-image" className="h-12 mb-2" />
            <p className="text-[14px] font-semibold">Help me with my Code</p>
          </div>
        </div>
      </section>
      <form
        action=""
        className="flex justify-center items-center bg-[#2c2937] p-0.5 rounded-[20px] w-full xs:w-[70%] sm:w-[60%] lg:w-[50%] mx-auto my-4 gap-5"
        onSubmit={handleSubmit}
      >
        <input
          placeholder="Ask me anything..."
          type="text"
          name="text"
          className="p-4 rounded-[20px] flex-1 border-none outline-none bg-transparent"
        />
        <Button className="p-3.5 rounded-[50%] bg-[#605e68] flex justify-center items-center mr-3">
          <img src="/arrow.png" alt="submit-button" className="w-full h-full" />
        </Button>
      </form>
    </>
  );
};

export default DashBoard;
