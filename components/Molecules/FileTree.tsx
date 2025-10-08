"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export function FileTreeView({
  data,
  setCurrData,
}: {
  data: any;
  setCurrData: ({ data, name }: { data: string; name: string }) => void;
}) {
  const [selectedPath, setSelectedPath] = useState<string>("");

  return (
    <div
      className="font-mono dark:bg-black bg-zinc-100 child h-full text-sm
        pl-5 pt-5 space-y-1"
    >
      {Object.entries(data).map(([key, value]) => (
        <TreeNode
          key={key}
          name={key}
          value={value}
          level={0}
          setCurrData={setCurrData}
          setSelectedPath={setSelectedPath}
          selectedPath={selectedPath}
          path={key}
        />
      ))}
    </div>
  );
}

function TreeNode({
  name,
  value,
  level,
  setCurrData,
  selectedPath,
  setSelectedPath,
  path,
}: {
  name: string;
  value: any;
  level: number;
  setCurrData: ({ data, name }: { data: string; name: string }) => void;
  selectedPath: string;
  setSelectedPath: (path: string) => void;
  path: string;
}) {
  const isFolder = value && typeof value === "object" && !("data" in value);
  const [open, setOpen] = useState(level === 0); // ✅ default open if level 0
  const isSelected = selectedPath === path;

  const handleClick = () => {
    if (isFolder) {
      // ✅ Prevent toggling for level 0 folders (keep always open)
      if (level === 0) return;
      setOpen((o) => !o);
    } else {
      setCurrData({ data: value.data, name });
      setSelectedPath(path);
    }
  };

  return (
    <div className="w-full h-full" style={{ marginLeft: `${level * 12}px` }}>
      <Button
        variant="ghost"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        className={cn(
          "flex items-center justify-start mr-10 cursor-pointer select-none",
          "hover:bg-muted rounded-md px-2 py-1 w-auto transition-colors",
          isSelected && "bg-muted",
        )}
      >
        {isFolder ? (
          open ? (
            <ChevronDown size={14} className="mr-1" />
          ) : (
            <ChevronRight size={14} className="mr-1" />
          )
        ) : (
          <File size={14} className="mr-1 text-zinc-500" />
        )}
        {isFolder && <Folder size={14} className="mr-1 text-yellow-500" />}
        <span>{name}</span>
      </Button>

      {isFolder && open && (
        <motion.div
          animate={{ opacity: [0, 1] }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
          className="border-l border-zinc-700 pl-2 mt-1"
        >
          {Object.entries(value).map(([childName, childValue]) => (
            <TreeNode
              key={childName}
              name={childName}
              value={childValue}
              level={level + 1}
              setCurrData={setCurrData}
              selectedPath={selectedPath}
              setSelectedPath={setSelectedPath}
              path={`${path}/${childName}`}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
