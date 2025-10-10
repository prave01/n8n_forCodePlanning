import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ImportSvg from "../SVGs/ImportSvg";
import { useFileStore } from "@/store/store";
import { redirect } from "next/navigation";
import { parseZip } from "@/lib/utils";

export const InputGroup = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const setFileData = useFileStore((s) => s.setFileData);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (isGitHubUrl(githubUrl)) return toast.success("Processing");
    toast.error("Invalid github repo link");
  };

  const isGitHubUrl = (url: string) => {
    const githubRegex =
      /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\.git)?\/?$/i;
    return githubRegex.test(url);
  };

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.name.split(".").pop() === "zip") {
      setSelectedFile(file);
      toast.success("File Imported Successfully");
      return;
    }
    toast.error("Unsupported File Type");
  };

  const handleFileSubmit = async () => {
    const Buffer = await selectedFile?.arrayBuffer();
    if (!Buffer) return;

    const parsedData = await parseZip(Buffer);
    setFileData(parsedData);

    redirect("/prePlan/startPlan");
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className="w-[400px] h-[200px] bg-muted lg:scale-124 rounded-lg border-2
        border-zinc-500 dark:border-border border-dashed flex items-center
        justify-center gap-y-2 flex-col"
    >
      <div className="flex items-center justify-center gap-y-2 flex-col">
        <div className="flex gap-x-2">
          <div className="flex items-center justify-center gap-x-2">
            <Input
              ref={fileInputRef}
              onChange={handleFileChange}
              type="file"
              id="file"
              hidden
              className="z-10 absolute text-xs"
            />

            <label htmlFor="file" className="">
              <div
                onClick={handleFileSubmit}
                className="cursor-pointer p-2 dark:bg-black bg-zinc-200
                  rounded-lg"
              >
                <ImportSvg className="dark:stroke-zinc-400 stroke-black size-[18px]" />
              </div>
            </label>
            <Button
              onClick={handleFileSubmit}
              size={"icon-sm"}
              disabled={selectedFile ? false : true}
              className="text-xs rounded-md dark:hover:bg-black
                dark:hover:text-white cursor-pointer"
            >
              Go
            </Button>
          </div>
        </div>
        {selectedFile && (
          <div className="flex gap-x-2 items-center justify-center">
            <div
              className="text-xs bg-background rounded-lg px-2 py-1
                text-orange-500"
            >
              {selectedFile.name}
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-xs rounded-full flex cursor-pointer items-center
                justify-center text-accent-foreground"
            >
              x
            </button>
          </div>
        )}
      </div>
      <div
        className="text-[12px] space-y-2 w-full tracking-tight leading-5 h-auto
          text-center"
      >
        Import the project as{" "}
        <span className="text-orange-500 font-semibold">Zip file</span> or{" "}
        <br /> Paste the{" "}
        <span className="text-orange-500 font-semibold">Github URL</span> of the
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
          required
          className="flex-1 text-xs h-8 placeholder:text-xs"
          placeholder="Paste url here"
        />
        <Button
          className="text-xs px-2 h-8 dark:hover:bg-black dark:hover:text-white
            cursor-pointer"
        >
          Go
        </Button>
      </form>
    </div>
  );
};
