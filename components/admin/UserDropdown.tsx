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
import AddFundsModal from "./AddFundsModal"

type Props = {
  name: string
  email: string
  balance?: number
  activeMode?: "buyer" | "publisher"
  canPublish?: boolean
  canBuy?: boolean
}

export default function UserDropdown({ name, email, balance = 0, activeMode, canPublish, canBuy }: Props) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [fundsOpen, setFundsOpen] = React.useState(false)
  const showModeSwitcher = !!activeMode && !!(canPublish && canBuy)
  const initial = name?.charAt(0).toUpperCase() || "U"

  return (
    <div className="relative">
      <DropdownMenu onOpenChange={setIsOpen}>
        <div className="group relative">
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5 focus:outline-none hover:scale-105 transition-transform duration-200"
              aria-label="User menu"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                {initial}
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-64 p-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-xl"
          >
            {/* Profile card */}
            <div className="flex items-center justify-between gap-3 p-3 mb-1 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50">
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{name}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{email}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5 flex-shrink-0">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-xs">
                  {initial}
                </div>
              </div>
            </div>

            {/* Balance + Add Funds */}
            <div className="flex items-center justify-between px-3 py-2 mb-1 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/50">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Balance</span>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">${balance.toFixed(2)}</span>
              </div>
              <button
                type="button"
                onClick={() => { setIsOpen(false); setFundsOpen(true) }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 transition-all duration-150 shadow-sm"
              >
                + Add Funds
              </button>
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

      {fundsOpen && <AddFundsModal onClose={() => setFundsOpen(false)} />}
    </div>
  )
}
