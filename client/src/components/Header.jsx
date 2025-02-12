import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button.jsx";

const Header = () => {
  return (
    <div className="flex items-center">
      <Link
        to="/"
        className="mr-auto :hover:cursor-pointer flex gap-2 items-center"
      >
        <img
          src="../../public/logo.png"
          alt="logo"
          className="inline-block h-8"
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
