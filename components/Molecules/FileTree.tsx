"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function FileTreeView({
  data,
  setCurrData,
}: {
  data: any;
  setCurrData: (data: string) => void;
}) {
  const [selectedPath, setSelectedPath] = useState<string>("");

  return (
    <div className="font-mono text-sm pl-5 pt-5 space-y-1">
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
  setCurrData: (data: string) => void;
  selectedPath: string;
  setSelectedPath: (path: string) => void;
  path: string;
}) {
  const [open, setOpen] = useState(false);

  const isFolder = value && typeof value === "object" && !("data" in value);
  const isSelected = selectedPath === path;

  const handleClick = () => {
    if (isFolder) {
      setOpen((o) => !o);
    } else {
      setCurrData(value.data);
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
          "flex items-center mr-10 cursor-pointer select-none",
          "hover:bg-muted rounded-md px-2 py-1 transition-colors",
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
        <span className="overflow-hidden">{name}</span>
      </Button>

      {isFolder && open && (
        <div className="border-l border-zinc-700 pl-2 mt-1">
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
        </div>
      )}
    </div>
  );
}
