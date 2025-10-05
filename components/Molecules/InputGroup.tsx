"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ImportSvg from "../SVGs/ImportSvg";

export const InputGroup = () => {
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const [githubUrl, setGithubUrl] = useState<string>("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (isGitHubUrl(githubUrl)) return toast.success("Processing");
    toast.error("Invalid github repo like");
  };

  const isGitHubUrl = (url: string) => {
    const githubRegex =
      /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\.git)?\/?$/i;
    return githubRegex.test(url);
  };

  const handleFileChange = (e: any) => {
    if (String(e?.target?.files[0]?.name).split(".")[1] === "zip") {
      setSelectedFile(e.target.files[0]);
      toast.success("File Imported Successfully");
      return;
    }
    toast.error("Unsupported File Type");
  };

  return (
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
          <span className="text-xs text-orange-500">{selectedFile?.name}</span>
        )}
      </div>
      <div className="text-[12px] space-y-2 w-full tracking-tight leading-5 h-auto text-center ">
        Import the project as Zip file or <br /> Paste the Github URL of the
        repo here
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex px-3 gap-x-2 w-full py-auto"
      >
        <Input
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          type="text"
          className="flex-1 text-xs h-8 placeholder:text-xs"
          placeholder="Paste url here"
        />
        <Button className="text-xs px-2 h-8 dark:hover:bg-black dark:hover:text-white cursor-pointer">
          Submit
        </Button>
      </form>
    </div>
  );
};
