import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import ImageKit from "imagekit";
import model from "./lib/gemini.js";
import getAnswer from "./ai/getAnswers.js";
import connectDB from "./db/index.js";
import { UserChats } from "./models/userChats.models.js";
import { Chat } from "./models/chat.models.js";
import { clerkClient, ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const PORT = process.env.PORT || 3000;
const app = express();
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT,
});

app.use(
  cors({
    origin: "https://gareer-ai.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "X-CSRF-Token",
      "X-Requested-With",
      "Content-Range",
      "Accept",
      "Accept-Version",
      "Content-Length",
      "Content-MD5",
      "Content-Type",
      "Date",
      "X-Api-Version",
      "Authorization",
    ],
    credentials: true,
  })
);

// Handle preflight requests
// app.options("*", cors());

app.use(express.json());

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// for Server-Sent Events (SSE) used for realtime updates the method should be GET
// yet to be implemented

app.get("/api/generateSSE", ClerkExpressRequireAuth(), async (req, res) => {
  const { userId } = req.auth;

  const { question, imageFilePath, imageURL, imageName, chatId, onlyAnswer } =
    req.query;

  const image =
    imageFilePath && imageURL && imageName
      ? {
          filePath: imageFilePath,
          url: imageURL,
          name: imageName,
        }
      : undefined;

  const chatData = await Chat.findOne({ _id: chatId, userId });

  if (!chatData) {
    return res.status(500).json("Chat not found");
  }
  const history =
    chatData?.history?.map(({ role, parts }) => ({
      role,
      parts: parts.map(({ text }) => ({ text })), // Keep text inside an object
    })) || [];

  // console.log("question: ", question);
  // console.log("chatID: ", chatId);
  // console.log("onlyAnswer: ", onlyAnswer);
  // console.log("image: ", image);

  try {
    if (!question) {
      return res.status(400).send("Question is required");
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let answer = "";
    let newItems;

    const answerStream = await getAnswer(model, question, image, history);
    for await (const chunk of answerStream) {
      // process.stdout.write(chunk); // Print each chunk as it arrives
      res.write(`data: ${chunk}\n\n`);
      answer += chunk;
    }

    if (!res.writableEnded) {
      res.write(`data: [DONE]\n\n`);
      res.end();
    }

    req.on("close", () => {
      console.log("Connection closed");
      res.end();
    });

    if (onlyAnswer === "true") {
      newItems = [
        {
          role: "model",
          parts: [{ text: answer }],
        },
      ];
    } else {
      console.log("question: ", question);
      newItems = [
        ...(question
          ? [
              {
                role: "user",
                parts: [{ text: question }],
                img: image && image.filePath,
              },
            ]
          : []),
        {
          role: "model",
          parts: [{ text: answer }],
        },
      ];
    }

    console.log("newItems: ", newItems);

    // const updatedChat = await Chat.findOneAndUpdate(
    //   { _id: chatId, userId },
    //   {
    //     $push: {
    //       history: {
    //         $each: newItems,
    //       },
    //     },
    //   },
    //   {
    //     new: true,
    //   }
    // );

    if (chatData) {
      chatData.history.push(...newItems); // Append new items to history
      const updatedChat = await chatData.save(); // Save the updated document
    }
  } catch (error) {
    console.log("Error while generating answer: ", error);
    res.status(500).json("Error while generating answer!");
  }
});

app.post("/api/generate", ClerkExpressRequireAuth(), async (req, res) => {
  const { userId } = req.auth;

  try {
    const { question, image: imgObject, chatId, onlyAnswer } = req.body;

    console.log(question, imgObject, chatId, onlyAnswer);

    let image =
      imgObject && imgObject.filePath && imgObject.url && imgObject.name
        ? {
            filePath: imgObject.filePath,
            url: imgObject.url,
            name: imgObject.name,
          }
        : undefined;

    if (!question) {
      return res.status(400).send("Question is required");
    }

    const chatData = await Chat.findOne({ _id: chatId, userId });

    if (!chatData) {
      return res.status(500).json("Chat not found");
    }
    const history =
      chatData?.history?.map(({ role, parts }) => ({
        role,
        parts: parts.map(({ text }) => ({ text })), // Keep text inside an object
      })) || [];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // const answer = await getAnswer(model, question, image);
    let answer = "";
    let newItems;

    const answerStream = await getAnswer(model, question, image, history);
    for await (const chunk of answerStream) {
      // process.stdout.write(chunk); // Print each chunk as it arrives
      res.write(`data: ${chunk}\n\n`);
      answer += chunk;
    }

    if (!res.writableEnded) {
      res.write(`data: [DONE]\n\n`);
      res.end();
    }

    req.on("close", () => {
      console.log("Connection closed");
      res.end();
    });

    if (onlyAnswer) {
      newItems = [
        {
          role: "model",
          parts: [{ text: answer }],
        },
      ];
    } else {
      newItems = [
        ...(question
          ? [
              {
                role: "user",
                parts: [{ text: question }],
                img: image && image.filePath,
              },
            ]
          : []),
        {
          role: "model",
          parts: [{ text: answer }],
        },
      ];
    }

    // const updatedChat = await Chat.updateOne(
    //   { _id: chatId, userId },
    //   {
    //     $push: {
    //       history: {
    //         $each: newItems,
    //       },
    //     },
    //   },
    //   {
    //     new: true,
    //   }
    // );

    chatData.history.push(...newItems); // Append new items to history
    const updatedChat = await chatData.save(); // Save the updated document
  } catch (error) {
    console.log("Error while generating answer: ", error);
    res.status(500).json("Error while generating answer!");
  }
});

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const { userId } = req.auth;

  try {
    const userChats = await UserChats.findOne({ userId });

    if (!userChats) {
      return res.status(500).json([]);
    }

    res.status(201).json(userChats.chats);
  } catch (error) {
    console.log("Error while fetching user chats: ", error);
    res.status(500).json("Error while fetching user chats!");
  }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const { userId } = req.auth;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });

    if (!chat) {
      return res.status(500).json("Chat not found");
    }

    res.status(201).json(chat);
  } catch (error) {
    console.log("Error while fetching chat: ", error);
    res.status(500).json("Error while fetching chat!");
  }
});

app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  const { userId } = req.auth;
  const { text } = req.body;

  if (!text) {
    return res.status(400).send("Question is required");
  }

  try {
    const newChat = new Chat({
      userId,
      history: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
    });

    const savedChat = await newChat.save();

    //Check if userChat exists
    const userChats = await UserChats.find({ userId });

    if (!userChats.length) {
      const newUserChat = new UserChats({
        userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChat.save();
    } else {
      await UserChats.findOneAndUpdate(
        { userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        },
        { new: true }
      );
    }

    res.status(201).json(savedChat._id);
  } catch (error) {
    console.log("Error creating chat:", error);
    res.status(500).json("Error creating chat!");
  }
});

app.get("/api/test", ClerkExpressRequireAuth(), async (req, res) => {
  console.log(req.auth);
  res.send("Success");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated! (Clerk)");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
