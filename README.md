# GAREER-AI

GAREER-AI is an AI-powered chatbot web application that allows users to interact with an AI assistant, similar to Gemini. Users can send text messages, upload images for analysis, and have a persistent chat history to simulate memory retention.

## 🚀 Features

- 🤖 **AI Chat** - Users can chat with an AI assistant just like Gemini.
- 🖼️ **Image Analysis** - Users can upload images and ask the AI questions about them.
- 💾 **Chat History** - The AI retains previous conversations to mimic memory.
- 🔒 **User Authentication** - Secure login and authentication powered by Clerk.
- 🏗️ **Fully Responsive** - Works seamlessly across all devices.
- 📡 **Optimized API Calls** - Efficient API calls and caching using Tanstack React Query.

---

## 🛠️ Tech Stack

### Frontend

- **React** - Main frontend framework
- **Tailwind CSS** - Styling
- **Tanstack React Query** - API calls and caching

### Backend

- **Node.js** - Backend runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Gemini API** - AI chatbot integration

### Additional Services

- **Clerk** - Authentication and authorization (frontend & backend)
- **ImageKit** - Image uploads and storage

---

## 🏗️ Installation & Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/GareerSenpai/GAREER-AI.git
cd GAREER-AI
```

### 2️⃣ Install Dependencies

## Install frontend dependencies

```sh
cd client
npm install
```

## Install backend dependencies

```sh
cd ../server
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root of the server directory and add:

```sh
MONGO_URI=your_mongo_database_url
DB_NAME=your_database_name
GEMINI_API_KEY=your_gemini_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
IMAGEKIT_ENDPOINT==your_imagekit_url_endpoint
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_secret_key
CLIENT_URL=your_frontend_server_url
```

Create a `.env` file in the root of the client directory and add:

```sh
VITE_CLERK_PUBLISHABLE_KEY=your_imagekit_public_key
VITE_IMAGEKIT_ENDPOINT=your_imagekit_url_endpoint
VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
VITE_SERVER_BASE_URL=your_backend_server_url
```

### 4️⃣ Run the Project

## Start the backend server

```sh
cd server
npm start
```

## Start the frontend server

```sh
cd ../client
npm run dev
```
