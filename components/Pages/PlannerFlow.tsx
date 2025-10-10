import {
  addEdge,
  Background,
  Controls,
  type DefaultEdgeOptions,
  type Edge,
  type FitViewOptions,
  type Node,
  type OnConnect,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import PlanCard from "../Atoms/PlanCard";
import CustomEdge from "../ReactFlow/CustomEdge";
import { useContextData, usePlan, useRunConnectedNodes } from "@/store/store";
import { Button } from "../ui/button";
import { PlanInput } from "../Atoms/PlanInput";
import { GridLoader } from "react-spinners";
import { AnimatePresence, motion } from "motion/react";

export const PlannerFlow = ({ tree }: { tree: Record<string, any> }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [open, setOpen] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const AI_Response = usePlan((s) => s.plan);
  const contextData = useContextData((s) => s.contextData);

  useEffect(() => {
    if (!AI_Response || AI_Response.length === 0) return;

    console.log("Plan", AI_Response);
    console.log("Context", contextData);

    const generatedNodes: any = AI_Response.map((plan, index) => ({
      id: `n${index + 1}`,
      position: { x: index * 510, y: 0 },
      type: "plan",
      data: {
        planName: plan.planName,
        planPrompt: plan.planPrompt,
        planDescription: plan.planDescription,
        targetFile: plan.targetFile,
        codeData: contextData[plan.targetFile],
        nodeId: `n${index + 1}`,
      },
    }));

    setNodes(generatedNodes);
  }, [AI_Response, contextData, setEdges, setNodes]);

  const edgeTypes = {
    "custom-edge": CustomEdge,
  };

  const defaultEdgeOptions: DefaultEdgeOptions = {
    animated: true,
  };

  const fitViewOptions: FitViewOptions = {
    padding: 0.2,
  };

  const setRunState = useRunConnectedNodes((s) => s.setRunState);

  const onConnect: OnConnect = useCallback(
    (params) => {
      const edge = { ...params, type: "custom-edge" };
      setEdges((eds) => addEdge(edge, eds));
      setRunState({ nodeId: params.source, status: false });
    },
    [setEdges],
  );

  const nodeTypes = { plan: PlanCard };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        className="bg-transparent text-black"
      >
        <motion.div
          className="absolute top-3 right-3 z-40"
          initial={false}
          animate={{
            rotate: open ? 45 : 0, // rotate "+" to "x"
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <Button
            onClick={() => setOpen(!open)}
            className="hover:bg-black hover:border-1 border-zinc-700 cursor-pointer flex items-center justify-center size-10 bg-zinc-800 rounded-full text-2xl text-zinc-200"
          >
            +
          </Button>
        </motion.div>

        <AnimatePresence>
          {open && (
            <motion.div
              key="plan-input"
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ transformOrigin: "top right" }}
              className="w-md border-1 border-zinc-700 absolute backdrop-blur-md p-2 rounded-lg z-40 right-3 top-16"
            >
              <PlanInput setLoading={setLoading} tree={tree} />
            </motion.div>
          )}
        </AnimatePresence>
        {isLoading && (
          <div
            className="backdrop-blur-md flex items-center justify-center absolute
            inset-0 z-20"
          >
            <GridLoader color="#ff4d00" />
          </div>
        )}

        <Background className="bg-transparent text-black" />
        <Controls className="bg-transparent text-black" />
      </ReactFlow>
    </div>
  );
};
