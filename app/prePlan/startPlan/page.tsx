"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFileStore } from "@/app/store/useFileStore";
import { parseZip, buildTree } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CodePanel } from "@/components/Templates/CodePanel";
import { Plan } from "@/components/Templates/Plan";
import { GridLoader } from "react-spinners";

export default function Page() {
  const router = useRouter();
  const buffer = useFileStore((s) => s.arrayBuffer);
  const [tree, setTree] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!tree) {
    if (!isClient)
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* optional static fallback while waiting for hydration */}
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
