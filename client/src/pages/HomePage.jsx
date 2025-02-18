import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { TypeAnimation } from "react-type-animation";

const HomePage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");
  const { user, isLoaded } = useUser();

  if (user) console.log(user);

  return (
    <div className="grid md:grid-cols-2 place-items-center h-full">
      <div className="flex flex-col justify-center items-center gap-8 h-full relative overflow-hidden">
        <img
          src="/orbital.png"
          className="absolute left-0 bottom-0 opacity-5 orbitalAnimation -z-10"
        />
        <h1 className="heading-bg w-fit text-4xl sm:text-6xl font-bold text-center">
          GAREER AI
        </h1>
        <h2 className="text-2xl font-bold text-center">
          Supercharge your creativity and productivity
        </h2>
        <h3 className="text-center w-[70%]">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere,
          fugiat non eos distinctio quos aliquam autem h.
        </h3>
        {/* there could be a better logic for routing */}
        <Link to={`${user ? "/dashboard" : "/sign-in"}`}>
          <Button variant="blue" className="py-6 px-8 rounded-[30px]">
            Get Started
          </Button>
        </Link>
      </div>
      <div className="hidden md:block imgContainer w-[80%] h-[50%] rounded-[50px] bg-[#140e2d] relative">
        <div className="bgContainer w-full h-full rounded-[50px] absolute overflow-hidden">
          <div className="bg-[url('/bg.png')] w-[200%] h-[100%] bg-[length:auto_100%] opacity-20 bgAnimation"></div>
        </div>
        <img
          src="/bot.png"
          className="mainBot w-[60%] absolute left-1/2 h-full object-contain botAnimation"
          alt="bot-image"
        />
        <div className="chat flex absolute justify-center items-center bg-[#2c2937] gap-4 p-[20px] bottom-[-30px] right-[-50px] rounded-[10px]">
          <img
            src={`${
              typingStatus === "bot"
                ? "/bot.png"
                : typingStatus === "human1"
                ? "/human1.jpeg"
                : "/human2.jpeg"
            }`}
            alt="convo-img"
            className="w-8 h-8 object-cover rounded-[50%]"
          />
          <TypeAnimation
            sequence={[
              "Human1: We produce food for Mice",
              1000, // wait 1s before replacing "Mice" with "Hamsters"
              () => setTypingStatus("bot"),
              "Bot: We produce food for Hamsters",
              1000,
              () => setTypingStatus("human2"),
              "Human2: We produce food for Guinea Pigs",
              1000,
              () => setTypingStatus("bot"),
              "Bot: We produce food for Chinchillas",
              1000,
              () => setTypingStatus("human1"),
            ]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
