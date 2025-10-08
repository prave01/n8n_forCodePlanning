import { useState } from "react";
import { FileTreeView } from "../Molecules/FileTree";
import { CodeBlock } from "../ui/code-block";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";

export const CodePanel = ({ tree }: { tree: string }) => {
  const [currData, setCurrData] = useState<{
    data: string;
    name: string;
  } | null>(null);

  return (
    <div className="w-full flex h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} className="overflow-y-scroll">
          {" "}
          <div className="overflow-y-scroll h-full parent">
            <FileTreeView setCurrData={setCurrData} data={tree} />
          </div>
        </ResizablePanel>
        <ResizableHandle className="dark:bg-cyan-500 bg-orange-500" />
        <ResizablePanel>
          <div
            className="h-full w-full flex dark:bg-black bg-zinc-900
              overflow-y-auto text-orange-500 text-xl font-semibold
              border-zinc-700 border-1"
          >
            {currData && (
              <CodeBlock
                language={"jsx"}
                filename={currData.name}
                code={currData.data}
              />
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
