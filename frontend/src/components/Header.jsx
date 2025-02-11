import React from "react";
import { Menu, UserCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

const Header = ({ sidebarOpen, onMenuClick, userName = "User" }) => {
  return (
    <div className="fixed top-0 right-0 left-0 bg-white border-b border-gray-200 z-50">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-indigo-900">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium">Hi, {userName}</span>
          <Avatar>
            <UserCircle className="h-6 w-6" />
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default Header;
