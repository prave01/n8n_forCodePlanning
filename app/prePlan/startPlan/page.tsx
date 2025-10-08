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
    <div className="flex gap-5 items-center overflow-hidden relative justify-center w-full h-full min-h-screen">
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
