import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button.jsx";
import { SidebarContext } from "../contexts/SidebarProvider.jsx";

const Header = () => {
  const location = useLocation();
  const path = location.pathname;
  const showSidebarButton = /dashboard|chats/.test(path);

  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <div className="flex items-center gap-4">
      {showSidebarButton && (
        <div onClick={() => toggleSidebar()} className="cursor-pointer">
          Sidebar Button
        </div>
      )}
      <Link
        to="/"
        className="mr-auto :hover:cursor-pointer flex gap-2 items-center"
      >
        <img src="/logo.png" alt="logo" className="inline-block h-8" />
        <span>GAREER AI</span>
      </Link>

      {/* <SignedOut>
        <SignInButton />
      </SignedOut> */}
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
            },
          }}
        />
      </SignedIn>
    </div>
  );
};

export default Header;
