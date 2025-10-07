"use client";

import { useFileStore } from "@/app/store/useFileStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseZip, buildTree } from "../../../app/actions";
import { FileTreeView } from "@/components/Molecules/FileTree";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ReactDiffViewer from "react-diff-viewer-continued";
import { CodeBlock } from "@/components/ui/code-block";

export default function Page() {
  const router = useRouter();
  const buffer = useFileStore((s) => s.arrayBuffer);
  const [tree, setTree] = useState<any>(null);

  const [currData, setCurrData] = useState<string | null>(null);

  useEffect(() => {
    if (!buffer) {
      router.push("/");
      return;
    }

    (async () => {
      const files = await parseZip(buffer);
      console.log(files);
      const treeData = buildTree(files);
      setTree(treeData);
    })();
  }, [buffer, router]);

  if (!tree) return <div className="text-center text-sm mt-10">Loading...</div>;

  return (
    <div className="flex gap-5 items-center justify-center w-full h-full min-h-screen">
      <ResizablePanelGroup direction={"horizontal"}>
        <ResizablePanel>
          <div className="bg-muted p-5 w-full h-full"></div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div className="w-full flex h-screen">
            <FileTreeView setCurrData={setCurrData} data={tree} />
            <div
              className="h-full w-full text-orange-500 text-xl font-semibold
              border-zinc-700 border-1"
            >
              {currData && (
                <CodeBlock language="js" filename="summa" code={currData} />
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
