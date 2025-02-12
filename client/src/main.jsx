import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import DashBoardLayout from "./layouts/DashBoardLayout.jsx";
import App from "./App.jsx";
import "./index.css";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ThemeProvider } from "./components/theme-provider.jsx";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/sign-in/*",
        element: <SignInPage />,
      },
      {
        path: "/sign-up/*",
        element: <SignUpPage />,
      },
      {
        element: (
          <ProtectedRoute>
            <DashBoardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/dashboard",
            element: <DashBoard />,
          },
          {
            path: "/dashboard/chats/:id",
            element: <ChatPage />,
          },
        ],
      },
    ],
  },
]);

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<App />}>
//       <Route path="" element={<HomePage />} />
//       <Route path="dashboard" element={<DashBoard />}>
//         <Route path="chats/:id" element={<ChatPage />} />
//       </Route>
//     </Route>
//   )
// );

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </ThemeProvider>
  </StrictMode>
);
