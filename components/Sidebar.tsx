"use client";

import React, { useState } from "react";
import {
  FiDollarSign,
  FiHome,
  FiChevronsUp,
  FiPenTool,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const toggleSidebar = () => setOpen(!open);

  return (
    <motion.nav
      layout
      className="fixed bottom-4 right-4 z-40 bg-white border border-slate-300 rounded-lg shadow-lg p-2"
      initial={{ width: "fit-content", height: "fit-content" }}
      animate={{
        width: open ? "225px" : "fit-content",
        height: open ? "auto" : "fit-content",
      }}
      transition={{ type: "tween", duration: 0.3 }}
    >
      {/* Expanded Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-1 mb-2"
          >
            <Link href="/admin/dashboard" onClick={() => setOpen(false)}>
              <Option
                Icon={FiHome}
                title="Dashboard"
                selected={selected}
                setSelected={setSelected}
                open={true}
              />
            </Link>
            <Link href="/admin/new" onClick={() => setOpen(false)}>
              <Option
                Icon={FiDollarSign}
                title="Create"
                selected={selected}
                setSelected={setSelected}
                open={true}
                notifs={3}
              />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock Toggle (Icons when closed, Toggle when open) */}
      <div className="flex flex-col items-center gap-2">
        {!open && (
          <div className="flex flex-col gap-2">
            <Link href="/admin/dashboard">
              <Button
                variant="ghost"
                size="icon"
                className={`text-slate-500 hover:bg-slate-100 ${
                  selected === "Dashboard" ? "bg-indigo-100 text-indigo-800" : ""
                }`}
                onClick={() => setSelected("Dashboard")}
              >
                <FiHome className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/admin/new">
              <Button
                variant="ghost"
                size="icon"
                className={`text-slate-500 hover:bg-slate-100 relative ${
                  selected === "Create" ? "bg-indigo-100 text-indigo-800" : ""
                }`}
                onClick={() => setSelected("Create")}
              >
                <FiPenTool className="h-5 w-5" />
                {selected !== "Create" && (
                  <span className="absolute -top-1 -right-1 size-4 rounded-full bg-indigo-500 text-xs text-white grid place-content-center">
                    3
                  </span>
                )}
              </Button>
            </Link>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-slate-500 hover:bg-slate-100"
        >
          <FiChevronsUp
            className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </Button>
      </div>
    </motion.nav>
  );
};

const Option = ({
  Icon,
  title,
  selected,
  setSelected,
  open,
  notifs,
}: {
  Icon: React.ElementType;
  title: string;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  open: boolean;
  notifs?: number;
}) => {
  return (
    <motion.button
      layout
      onClick={() => setSelected(title)}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
        selected === title
          ? "bg-indigo-100 text-indigo-800"
          : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      <motion.div layout className="grid h-full w-10 place-content-center text-lg">
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-xs font-medium"
        >
          {title}
        </motion.span>
      )}

      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ y: "-50%" }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white grid place-content-center"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
  );
};