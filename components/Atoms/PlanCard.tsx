import { Handle, Position, useReactFlow } from "@xyflow/react";
import ExecuteAI from "@/actions/ExecutionAI";
import type { PlanCardExtendedType } from "@/app/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { GridLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { replaceData } from "@/lib/utils";
import { useFileStore, useRunConnectedNodes } from "@/store/store";
import { toast } from "sonner";
import { run } from "node:test";

const PlanCard = ({ data }: { data: PlanCardExtendedType }) => {
  const [loading, setLoading] = useState(false);
  const [executionState, setExecutionState] = useState<
    Array<{
      id: number;
      status: "ok" | null;
      statusData: string;
      targetFile: string;
      time: string;
    }>
  >([]);

  const runState = useRunConnectedNodes((s) => s.runState);
  const setRunState = useRunConnectedNodes((s) => s.setRunState);

  const [cardState, setCardState] = useState<"ready" | "done" | "error">(
    "ready",
  );

  const { getNodeConnections } = useReactFlow();

  const fileData = useFileStore((s) => s.fileData);
  const setFileData = useFileStore((s) => s.setFileData);

  useEffect(() => {
    if (runState.status) {
      const connections = getNodeConnections({
        nodeId: runState.nodeId,
        type: "source",
      });
      console.log("Connections data", connections);
      if (connections.length === 0) return;
      const isIncludeCurr = connections.map((i) => {
        if (data.nodeId === i.target && runState.nodeId === i.source) {
          return true;
        }
        return false;
      });
      if (
        isIncludeCurr &&
        runState.nodeId !== data.nodeId &&
        runState.refData?.code
      ) {
        console.log("Code from ref", runState.refData?.code);

        console.log("Got it and running", data.nodeId);
        handleExecute(runState.refData);
      }
    }
  }, [runState.status, data.nodeId, getNodeConnections]);

  const handleExecute = async (refData?: {
    fileName: string;
    code: string;
  }) => {
    try {
      setLoading(true);

      let response;
      if (refData?.code) {
        console.log("Got running refData");
        response = await ExecuteAI(planPrompt, codeData, refData);
      } else {
        response = await ExecuteAI(planPrompt, codeData);
      }

      setLoading(false);
      setExecutionState((prev) => [
        ...prev,
        {
          id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 1,
          status: "ok",
          statusData: response?.code || "No data",
          targetFile: targetFile,
          time: getFormattedTime(),
        },
      ]);
      setCardState("done");
      setRunState({
        nodeId: data.nodeId,
        status: true,
        refData: {
          code: response.code,
          fileName: targetFile,
        },
      });
      console.log("CodeResponse", targetFile, "\n", response);
    } catch (err: any) {
      setLoading(false);
      setCardState("error");
      setExecutionState((prev) => [
        ...prev,
        {
          id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 1,
          status: null,
          statusData: err?.message || String(err),
          targetFile: targetFile,
          time: getFormattedTime(),
        },
      ]);
      console.error(err);
    }
  };

  const {
    planName,
    planDescription = [],
    planPrompt,
    targetFile,
    codeData,
  } = data;

  if (
    !planName ||
    !planDescription ||
    !planPrompt ||
    !targetFile ||
    !codeData
  ) {
    console.error("No valid inputs");
    return null;
  }

  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <>
      <Card className="max-w-[500px] relative p-0 gap-0 bg-gradient-to-t h-auto">
        {loading && (
          <div
            className="backdrop-blur-md border-1 border-zinc-700 rounded-lg flex
              items-center justify-center absolute inset-0 z-20"
          >
            <GridLoader color="#ff4d00" />
          </div>
        )}

        {cardState === "ready" && (
          <div
            className="absolute inset-0 -z-20"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249, 115, 22, 0.25), transparent 70%), #000000",
            }}
          />
        )}

        {cardState === "error" && (
          <div
            className="absolute inset-0 -z-20"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(236, 72, 153, 0.25), transparent 70%), #000000",
            }}
          />
        )}

        {cardState === "done" && (
          <div
            className="absolute inset-0 -z-20"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34, 197, 94, 0.25), transparent 70%), #000000",
            }}
          />
        )}

        <CardHeader
          className="p-2 w-full flex flex-row gap-x-4 items-center
            justify-between"
        >
          <CardTitle
            className="text-sm max-w-[200px] text-orange-500 w-fit
              font-semibold"
          >
            {planName}
          </CardTitle>
          <button
            type="button"
            onClick={() => {
              handleExecute();
            }}
            className="bg-blue-500/30 cursor-pointer text-shadow-white w-fit
              text-xs shadow-lg rounded-full px-2 py-1 font-medium border-1 flex
              items-center justify-center border-blue-500"
          >
            Execute on {targetFile}{" "}
            {runState.refData?.code &&
              runState.refData.fileName !== data.targetFile && (
                <p className="text-white">
                  Got data from {runState.refData.fileName}
                </p>
              )}
          </button>
        </CardHeader>

        <hr className="bg-zinc-800 w-full h-0.5" />

        <CardContent className="p-2">
          <CardTitle className="text-sm font-medium">Description</CardTitle>
          <CardDescription
            className="text-xs py-1 text-justify px-2 dark:text-zinc-300
              font-normal text-black flex flex-col gap-y-2"
          >
            <ol className="gap-y-1 list-disc pl-2 flex flex-col">
              {planDescription.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </CardDescription>
        </CardContent>

        <hr className="bg-zinc-800 w-full h-0.5" />

        <CardContent className="p-2">
          <CardTitle className="text-sm font-medium">Plan Prompt</CardTitle>
          <CardDescription
            className="text-xs py-1 text-justify px-2 dark:text-zinc-300
              font-normal text-black"
          >
            {planPrompt}
          </CardDescription>
        </CardContent>

        {executionState.length > 0 && (
          <>
            <hr className="bg-zinc-800 w-full h-0.5" />
            <CardFooter className="p-2 flex flex-col items-start">
              <CardTitle className="text-sm font-medium">Executions</CardTitle>
              <CardDescription className="p-2 w-full flex flex-col gap-y-2">
                {executionState.map((item, idx) => (
                  <div
                    key={item.id}
                    className="w-full gap-x-1 text-xs text-white flex
                      items-center justify-between"
                  >
                    <div className="flex gap-x-2 items-center">
                      <span>#{idx + 1}</span>
                      {item.status === "ok" ? (
                        <span className="text-green-500 font-semibold">
                          Success
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">
                          Fails
                        </span>
                      )}
                    </div>
                    <div className="flex-1 h-0.5 border-1 border-dashed"></div>
                    {item.status === "ok" ? (
                      <div className="gap-x-2 flex items-center justify-center">
                        <span className="text-zinc-400">{item.time}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newFilesData = replaceData(
                              fileData,
                              executionState[idx].statusData,
                              executionState[idx].targetFile,
                            );
                            if (newFilesData) {
                              setFileData(newFilesData);
                              toast.success("Data updated successfully");
                              return;
                            }
                            toast.error("Cannot update the data");
                          }}
                          className="px-2 py-1 rounded-md text-green-200
                            bg-green-500/50 cursor-pointer"
                        >
                          Set data
                        </button>
                      </div>
                    ) : (
                      <div className="gap-x-2 flex items-center justify-center">
                        <span className="text-zinc-400">{item.time}</span>
                        <div
                          className="px-4 py-1 rounded-md text-red-200
                            bg-red-500/50 cursor-pointer"
                        >
                          See error
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardDescription>
            </CardFooter>
          </>
        )}
      </Card>

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </>
  );
};

export default PlanCard;
