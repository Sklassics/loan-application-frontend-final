"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, User, Settings, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import axios from "axios";

export function UserNav() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const logout = useAuthStore((state) => state.logoutAction);

  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    selfieImage: "",
  });

  // Fetch user data from the dashboard API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("auth_token");

        const headers = {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        };

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard`, {
          headers,
        });

        if (response.data && response.data.dashboardData && response.data.dashboardData.profile) {
          const profile = response.data.dashboardData.profile;
          setUserData({
            firstName: profile.firstName || "John",
            lastName: profile.lastName || "Doe",
            email: profile.mobile?.email || "john.doe@example.com",
            selfieImage: profile.selfieImage || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    console.log("Logging out...");
    await logout();
    console.log("Redirecting...");
    router.push("/login");
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 border-2 border-violet-200 hover:border-violet-400 transition-colors">
              {/* Display the selfieImage if available, otherwise fallback to initials */}
              {userData.selfieImage ? (
                <AvatarImage src={`data:image/jpeg;base64,${userData.selfieImage}`} alt="User" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                  {userData.firstName.charAt(0)}
                  {userData.lastName.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-1" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userData.firstName} {userData.lastName}
            </p>
            <p className="text-xs leading-none text-slate-500">{userData.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push("/profile")}
            className="flex items-center cursor-pointer hover:bg-violet-50"
          >
            <User className="mr-2 h-4 w-4 text-violet-600" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/settings")}
            className="flex items-center cursor-pointer hover:bg-violet-50"
          >
            <Settings className="mr-2 h-4 w-4 text-violet-600" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/dashboard")}
            className="flex items-center cursor-pointer hover:bg-violet-50"
          >
            <LayoutDashboard className="mr-2 h-4 w-4 text-violet-600" />
            <span>Dashboard</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center cursor-pointer hover:bg-violet-50"
        >
          <LogOut className="mr-2 h-4 w-4 text-violet-600" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

