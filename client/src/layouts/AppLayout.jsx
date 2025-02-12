import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const AppLayout = () => {
  const queryClient = new QueryClient();

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <div className="py-4 px-6 lg:px-8 xl:px-12 h-screen flex flex-col">
          <Header />
          <main className="flex-1 overflow-hidden">
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default AppLayout;
