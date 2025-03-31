"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LogOut, User, Settings, LayoutDashboard } from "lucide-react"
import { useAuthStore } from "@/store/auth"

export function UserNav() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const logout = useAuthStore((state) => state.logoutAction)

  const handleLogout = () => {
    logout();
    router.push("/login")
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 border-2 border-violet-200 hover:border-violet-400 transition-colors">
              <AvatarImage src="/placeholder.svg?text=JD" alt="User" />
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">JD</AvatarFallback>
            </Avatar>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-1" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">John Doe</p>
            <p className="text-xs leading-none text-slate-500">john.doe@example.com</p>
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
  )
}

