"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handleFileChange = (e: any) => {
    if (String(e.target.files[0].name).split(".")[1] === "zip") {
      setSelectedFile(e.target.files[0]);
      toast.success("File Imported Successfully");
      return;
    }
    toast.error("Unsupported File Type");
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-background flex items-center justify-center">
      <div
        className={`
        max-w-[400px] w-full h-[200px] bg-muted lg:scale-124 rounded-lg border-2
        border-zinc-500 dark:border-border border-dashed flex items-center justify-center gap-y-2 flex-col
      `}
      >
        <div className="flex items-center justify-center gap-y-2 flex-col">
          <Input
            onChange={handleFileChange}
            type="file"
            id="file"
            hidden
            className="z-10 absolute"
          />
          <label htmlFor="file">
            <ImportSvg className="dark:stroke-zinc-400 stroke-black dark:bg-black bg-zinc-200 rounded-lg p-2 size-9" />
          </label>
          {selectedFile && (
            <span className="text-xs text-orange-500">
              {selectedFile?.name}
            </span>
          )}
        </div>
        <div className="text-[12px] space-y-2 w-full tracking-tight leading-5 h-auto text-center ">
          Import the project as Zip file or <br /> Paste the Github URL of the
          repo here
        </div>
        <form className="flex px-3 gap-x-2 w-full py-auto">
          <Input
            type="text"
            className="flex-1 text-xs h-8 placeholder:text-xs"
            placeholder="Paste url here"
          />
          <Button className="text-xs px-2 h-8 dark:hover:bg-black dark:hover:text-white cursor-pointer">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

function ImportSvg({ className }: { className?: ClassValue }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "icon icon-tabler icons-tabler-outline icon-tabler-file-import",
        className,
      )}
      role="img"
      aria-labelledby="importIconTitle"
    >
      <title id="importIconTitle">Import file icon</title>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3" />
    </svg>
  );
}
