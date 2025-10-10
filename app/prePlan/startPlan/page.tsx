"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GridLoader } from "react-spinners";
import { CodePanel } from "@/components/Templates/CodePanel";
import { Plan } from "@/components/Templates/Plan";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { buildTree } from "@/lib/utils";
import { useFileStore } from "@/store/store";

export default function Page() {
  const router = useRouter();
  const fileData = useFileStore((s) => s.fileData);
  const [tree, setTree] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (!fileData || Object.keys(fileData).length === 0) {
      router.push("/");
      return;
    }

    const treeData = buildTree(fileData);
    setTree(treeData);
  }, [fileData, router]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!tree) {
    if (!isClient)
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-orange-500 rounded-full animate-pulse" />
        </div>
      );

    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <GridLoader color="#ff4d00" />
      </div>
    );
  }

  return (
    <div
      className="flex gap-5 items-center overflow-hidden relative justify-center
        w-full h-full min-h-screen"
    >
      <ResizablePanelGroup direction={"horizontal"}>
        <ResizablePanel className="bg-transparent" defaultSize={40}>
          <Plan tree={tree} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <CodePanel tree={tree} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
