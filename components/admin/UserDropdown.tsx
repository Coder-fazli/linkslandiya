"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Settings, LogOut, ShoppingCart, FileText } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logOut, switchMode } from "@/app/(auth)/actions"

type Props = {
  name: string
  email: string
  balance?: number
  activeMode?: "buyer" | "publisher"
  canPublish?: boolean
  canBuy?: boolean
}

function AvatarSilhouette() {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
      <rect width="36" height="36" rx="18" fill="url(#avatarBgFill)"/>
      <ellipse cx="18" cy="13" rx="6.5" ry="7" fill="#1a1a2e"/>
      <path d="M5 34 C5 24 31 24 31 34" fill="#1a1a2e"/>
      <defs>
        <radialGradient id="avatarBgFill" cx="60%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#f97316"/>
          <stop offset="100%" stopColor="#dc2626"/>
        </radialGradient>
      </defs>
    </svg>
  )
}

export default function UserDropdown({ name, email, balance = 0, activeMode, canPublish, canBuy }: Props) {
  const [isOpen, setIsOpen] = React.useState(false)
  const showModeSwitcher = !!activeMode && !!(canPublish && canBuy)

  return (
    <div className="relative">
      <DropdownMenu onOpenChange={setIsOpen}>
        <div className="group relative">
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-4 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 hover:shadow-sm transition-all duration-200 focus:outline-none"
            >
              <div className="text-left flex-1">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                  {name}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 tracking-tight leading-tight mt-0.5">
                  {email}
                </div>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <AvatarSilhouette />
                  </div>
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>

          {/* Bending line indicator */}
          <div
            className={cn(
              "absolute -right-3 top-1/2 -translate-y-1/2 transition-all duration-200",
              isOpen ? "opacity-100" : "opacity-60 group-hover:opacity-100"
            )}
          >
            <svg
              width="12" height="24" viewBox="0 0 12 24" fill="none"
              className={cn(
                "transition-all duration-200",
                isOpen
                  ? "text-blue-500 dark:text-blue-400 scale-110"
                  : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
              )}
              aria-hidden="true"
            >
              <path d="M2 4C6 8 6 16 2 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-64 p-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-xl"
          >
            {/* Balance */}
            <div className="flex items-center justify-between px-3 py-2 mb-1 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Balance</span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">${balance.toFixed(2)}</span>
            </div>

            {/* Mode switcher */}
            {showModeSwitcher && (
              <div className="px-3 py-2 mb-1">
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider mb-2">Switch Mode</p>
                <div className="flex gap-2">
                  <form action={() => switchMode("buyer")} style={{ margin: 0, flex: 1 }}>
                    <button
                      type="submit"
                      className={cn(
                        "w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all duration-150",
                        activeMode === "buyer"
                          ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                          : "bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-blue-400 hover:text-blue-500"
                      )}
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Buyer
                    </button>
                  </form>
                  <form action={() => switchMode("publisher")} style={{ margin: 0, flex: 1 }}>
                    <button
                      type="submit"
                      className={cn(
                        "w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all duration-150",
                        activeMode === "publisher"
                          ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                          : "bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-blue-400 hover:text-blue-500"
                      )}
                    >
                      <FileText className="w-3 h-3" />
                      Publisher
                    </button>
                  </form>
                </div>
              </div>
            )}

            <div className="space-y-0.5">
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/settings"
                  className="flex items-center p-3 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 rounded-xl transition-all duration-200 cursor-pointer group border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">
                      Account Settings
                    </span>
                  </div>
                </Link>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="my-2 bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />

            <DropdownMenuItem asChild>
              <form action={logOut} style={{ margin: 0 }}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 p-3 duration-200 bg-red-500/10 rounded-xl hover:bg-red-500/20 cursor-pointer border border-transparent hover:border-red-500/30 hover:shadow-sm transition-all group"
                >
                  <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                  <span className="text-sm font-medium text-red-500 group-hover:text-red-600">
                    Sign Out
                  </span>
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      </DropdownMenu>
    </div>
  )
}
