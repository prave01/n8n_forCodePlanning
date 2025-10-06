"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import { Button } from "../ui/button";

export function FileTreeView({ data }: { data: any }) {
  return (
    <div className="font-mono text-sm space-y-1">
      {Object.entries(data).map(([key, value]) => (
        <TreeNode key={key} name={key} value={value} level={0} />
      ))}
    </div>
  );
}

function TreeNode({
  name,
  value,
  level,
}: {
  name: string;
  value: any;
  level: number;
}) {
  const [open, setOpen] = useState(false);
  const isFolder = value && typeof value === "object";

  return (
    <div style={{ marginLeft: `${level * 12}px` }}>
      {" "}
      {/* ⬅️ dynamic gap per level */}
      <Button
        variant="ghost"
        tabIndex={0}
        onClick={() => isFolder && setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            isFolder && setOpen((o) => !o);
          }
        }}
        className="flex items-center mr-10 cursor-pointer select-none hover:bg-muted rounded-md px-2 py-1"
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
        <div className="border-l border-zinc-700 pl-2 mt-1">
          {Object.entries(value).map(([childName, childValue]) => (
            <TreeNode
              key={childName}
              name={childName}
              value={childValue}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
