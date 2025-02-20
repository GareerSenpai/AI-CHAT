import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button.jsx";
import SidebarButton from "./SidebarButton.jsx";

const Header = () => {
  const location = useLocation();
  const path = location.pathname;
  const showSidebarButton = /dashboard|chats/.test(path);

  return (
    <div className="flex items-center gap-4">
      {showSidebarButton && <SidebarButton />}
      <Link
        to="/"
        className="mr-auto :hover:cursor-pointer flex gap-2 items-center"
      >
        <img
          src="/logo.png"
          alt="logo"
          className={`${path !== "/" && "hidden"} xs:inline-block h-8`}
        />
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
