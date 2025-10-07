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
import { CodePanel } from "@/components/Templates/CodePanel";
import { Bitcount_Prop_Double } from "next/font/google";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Plan } from "@/components/Templates/Plan";

export default function Page() {
  const router = useRouter();
  const buffer = useFileStore((s) => s.arrayBuffer);
  const [tree, setTree] = useState<any>(null);

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
    <div
      className="flex gap-5 items-center justify-center 
      w-full h-full min-h-screen"
    >
      <ResizablePanelGroup direction={"horizontal"}>
        <ResizablePanel defaultSize={25}>
          <Plan />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <CodePanel tree={tree} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
