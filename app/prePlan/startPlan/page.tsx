"use client";

import { useFileStore } from "@/app/store/useFileStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseZip, buildTree } from "../../../app/actions";
import { FileTreeView } from "@/components/Molecules/FileTree";

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
      const treeData = buildTree(files);
      setTree(treeData);
    })();
  }, [buffer, router]);

  if (!tree) return <div className="text-center text-sm mt-10">Loading...</div>;

  return (
    <div className="p-5">
      <FileTreeView data={tree} />
    </div>
  );
}
